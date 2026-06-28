"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  targetAlpha: number;
  baseColor: string; // original rgb string
  phase: number;
  twinkleSpeed: number;
  hueOffset: number; // individual hue variation
  layer: 0 | 1 | 2; // parallax depth layer
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

    // Mount-only: particle system setup, runs once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let time = 0;
    let windAngle = 0;
    const scrollRef = { current: 0 };

    const isDark = () => document.documentElement.classList.contains("dark");

    const resize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };

    const initParticles = () => {
      const w = canvas!.width;
      const h = canvas!.height;
      const count = Math.min(Math.floor((w * h) / 7000), 180);
      particles = Array.from({ length: count }, () => {
        const isBlue = Math.random() > 0.4;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.1,
          r: Math.random() * 3.2 + 0.8,
          alpha: Math.random() * 0.45 + 0.12,
          targetAlpha: Math.random() * 0.45 + 0.12,
          baseColor: isBlue ? "126,184,247" : "232,196,196",
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          hueOffset: (Math.random() - 0.5) * 40,
          layer: (r => r > 0.6 ? 1 : r > 0.3 ? 0 : 2)(Math.random()) as 0 | 1 | 2,
        };
      });
    };

    // Compute scroll-driven color (return rgb string)
    const scrollColor = (sp: number): string => {
      // sp=0 → ice blue, sp=0.5 → rose gold, sp=1 → deep purple-gold
      let r: number, g: number, b: number;
      if (sp < 0.5) {
        const t = sp / 0.5;
        r = 160 + t * 60;  // 160→220
        g = 200 - t * 15;  // 200→185
        b = 245 - t * 65;  // 245→180
      } else {
        const t = (sp - 0.5) / 0.5;
        r = 220 - t * 50;  // 220→170
        g = 185 - t * 35;  // 185→150
        b = 180 + t * 25;  // 180→205
      }
      return `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
    };

    const draw = () => {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const dark = isDark();
      time += 1;
      const sp = scrollRef.current; // 0 (top) → 1 (bottom)
      const scrollY = window.scrollY;
      const pf = [0.03, 0.08, 0.15]; // parallax factor per layer (back, mid, front)

      // ---- Scroll-driven parameters ----
      // Vertical bias: float up at top → sink down at bottom
      const vertBias = -0.25 + sp * 0.5; // -0.25 → +0.25

      // Speed multiplier: calm at edges, lively in middle
      const speedMul = Math.sin(sp * Math.PI) * 0.5 + 0.5;

      // Density multiplier: particles grow/shrink with scroll
      const densityMul = Math.sin(sp * Math.PI) * 0.35 + 0.65;

      // Connection line visibility: peaks in mid-scroll
      const connMul = Math.sin(sp * Math.PI) * 0.4 + 0.6;

      // Vortex strength (swirl): strongest around 40-60% scroll
      const vortexStr = Math.max(0, Math.sin(sp * Math.PI * 1.5) * 0.04);

      // Vortex center (slightly above center of view)
      const vx = w * 0.5;
      const vy = h * 0.45;

      // Base scroll color for this frame
      const sc = scrollColor(sp);
      const [sr, sg, sb] = sc.split(",").map(Number);

      // Wind (gentle, same as before)
      windAngle += 0.002;
      const windX = Math.sin(windAngle) * 0.1;
      const windY = Math.cos(windAngle * 0.7) * 0.06 - 0.02;

      // ---- UPDATE PARTICLES ----
      for (const p of particles) {
        // Wind
        p.vx += windX;
        p.vy += windY * speedMul;

        // Scroll vertical bias
        p.vy += vertBias * 0.02;

        // Vortex / swirl
        if (vortexStr > 0.001) {
          const dx = p.x - vx;
          const dy = p.y - vy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5 && dist < 350) {
            const f = (1 - dist / 350) * vortexStr;
            const a = Math.atan2(dy, dx);
            p.vx += Math.sin(a) * f;
            p.vy += -Math.cos(a) * f;
            // Slight inward pull
            const pull = (1 - dist / 350) * vortexStr * 0.3;
            p.vx -= (dx / dist) * pull;
            p.vy -= (dy / dist) * pull;
          }
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        const margin = p.r * 4;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 0) {
          const force = ((220 - dist) / 220) * 0.12;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Drag
        p.vx *= 0.993;
        p.vy *= 0.993;

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 2.5 + speedMul * 1.0; // faster in middle
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Twinkle
        p.alpha = p.targetAlpha + Math.sin(time * p.twinkleSpeed + p.phase) * 0.15;
      }

      // ---- DRAW PARTICLES ----
      for (const p of particles) {
        const baseAlpha = dark ? p.alpha : p.alpha * 0.85;

        // Blend particle's baseColor toward scroll color
        const [br, bg, bb] = p.baseColor.split(",").map(Number);
        const blend = 0.3 + sp * 0.4; // more scroll influence toward bottom
        const cr = Math.round(br + (sr - br) * blend);
        const cg = Math.round(bg + (sg - bg) * blend);
        const cb = Math.round(bb + (sb - bb) * blend);
        const colorStr = `${cr},${cg},${cb}`;

        const displayAlpha = Math.min(1, baseAlpha * densityMul);
        const displayR = p.r * densityMul;

        // Outer glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y + scrollY * pf[p.layer], displayR * 5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colorStr}, ${displayAlpha * 0.1})`;
        ctx!.fill();

        // Inner glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y + scrollY * pf[p.layer], displayR * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colorStr}, ${displayAlpha * 0.18})`;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(p.x, p.y + scrollY * pf[p.layer], displayR, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colorStr}, ${displayAlpha})`;
        ctx!.fill();
      }

      // ---- CONNECTION LINES ----
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const ay = a.y + scrollY * pf[a.layer];
          const by = b.y + scrollY * pf[b.layer];
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Connection distance expands in mid-scroll
          const maxDist = 120 + connMul * 60;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18 * connMul * (dark ? 1 : 0.85);
            // Color blends toward scroll color too
            const [br, bg, bb] = a.baseColor.split(",").map(Number);
            const blend = 0.3 + sp * 0.4;
            const cr = Math.round(br + (sr - br) * blend);
            const cg = Math.round(bg + (sg - bg) * blend);
            const cb = Math.round(bb + (sb - bb) * blend);
            ctx!.beginPath();
            ctx!.moveTo(a.x, ay);
            ctx!.lineTo(b.x, by);
            ctx!.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx!.lineWidth = 0.7;
            ctx!.stroke();
          }
        }
      }

      // ---- MOUSE AMBIENT GLOW ----
      if (mouseX > 0 && mouseY > 0) {
        // Mouse glow color also shifts with scroll
        const glowColor = dark 
          ? `rgba(${sc}, 0.06)` 
          : `rgba(${sr - 20},${sg - 20},${sb - 20}, 0.07)`;
        const gradient = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 160);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(0.4, `rgba(${sc}, ${dark ? 0.025 : 0.03})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      }

      animationId = requestAnimationFrame(draw);
    };

    // ---- SCROLL LISTENER ----
    const handleScroll = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = docEl.scrollHeight - window.innerHeight;
      scrollRef.current = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // ---- INIT ----
    resize();
    initParticles();
    draw();

    // ---- RESIZE ----
    window.addEventListener("resize", () => {
      resize();
    }, { passive: true });

    // ---- MOUSE ----
    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);

    // ---- CLEANUP ----
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100dvh" }}
    />
  );
}





