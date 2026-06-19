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
  color: string;
  phase: number;
  twinkleSpeed: number;
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const isDark = () => document.documentElement.classList.contains("dark");

    const resize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };

    const initParticles = () => {
      const w = canvas!.width;
      const h = canvas!.height;
      const count = Math.min(Math.floor((w * h) / 12000), 90);
      particles = Array.from({ length: count }, () => {
        const isBlue = Math.random() > 0.45;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.1,
          r: Math.random() * 2.5 + 0.6,
          alpha: Math.random() * 0.35 + 0.1,
          targetAlpha: Math.random() * 0.35 + 0.1,
          color: isBlue ? "126, 184, 247" : "232, 196, 196",
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        };
      });
    };

    const draw = () => {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const dark = isDark();
      time += 1;

      // Gentle wind that slowly rotates
      windAngle += 0.002;
      const windX = Math.sin(windAngle) * 0.08;
      const windY = Math.cos(windAngle * 0.7) * 0.04 - 0.02;

      // First pass: update & draw particles
      for (const p of particles) {
        // Wind
        p.vx += windX;
        p.vy += windY;

        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        const margin = p.r * 4;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // Mouse interaction - stronger repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * 0.08;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Drag
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        // Twinkle
        p.alpha = p.targetAlpha + Math.sin(time * p.twinkleSpeed + p.phase) * 0.12;

        // Draw glow
        const baseAlpha = dark ? p.alpha : p.alpha * 0.6;
        const glowSize = p.r * 4;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color}, ${baseAlpha * 0.08})`;
        ctx!.fill();

        // Draw particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color}, ${baseAlpha})`;
        ctx!.fill();
      }

      // Second pass: connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12 * (dark ? 1 : 0.6);
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(126, 184, 247, ${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }

      // Draw mouse ambient glow
      if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
        gradient.addColorStop(0, dark ? "rgba(126, 184, 247, 0.04)" : "rgba(74, 143, 224, 0.03)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

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

    return () => {
      cancelAnimationFrame(animationId);
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
