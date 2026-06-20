"use client";
import { useEffect, useRef, memo } from "react";

interface Props {
  onToggle: () => void;
  onDone: () => void;
}

function ThemeLensInner({ onToggle, onDone }: Props) {
  const warmRef = useRef<HTMLDivElement | null>(null);
  const coolRef = useRef<HTMLDivElement | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onToggle();
      onDone();
      return;
    }

    const warm = document.createElement("div");
    const cool = document.createElement("div");
    warmRef.current = warm;
    coolRef.current = cool;
    cancelRef.current = false;

    const base = "position:fixed;inset:0;pointer-events:none;";
    const isDark = document.documentElement.classList.contains("dark");

    // Set up initial styles with opacity: 0
    if (isDark) {
      warm.style.cssText =
        base +
        "z-index:9999;opacity:0;background:radial-gradient(ellipse 130% 80% at 50% 100%, rgba(180,210,245,0.45) 0%, rgba(160,190,230,0.25) 35%, rgba(140,175,215,0.1) 60%, transparent 80%)";
      cool.style.cssText =
        base +
        "z-index:9998;opacity:0;background:linear-gradient(180deg, rgba(255,248,235,0.35) 0%, rgba(255,235,210,0.15) 30%, transparent 60%)";
    } else {
      warm.style.cssText =
        base +
        "z-index:9999;opacity:0;background:radial-gradient(ellipse 110% 65% at 50% 100%, rgba(255,190,110,0.35) 0%, rgba(230,140,175,0.25) 25%, rgba(150,110,200,0.15) 50%, transparent 75%)";
      cool.style.cssText =
        base +
        "z-index:9998;opacity:0;background:radial-gradient(ellipse 110% 70% at 50% 50%, rgba(18,30,65,0.35) 0%, rgba(12,18,35,0.2) 50%, transparent 80%)";
    }

    document.body.append(warm, cool);

    // ── rAF-based animation runner ──
    let rafIds: number[] = [];

    const run = (el: HTMLElement, from: number, to: number, dur: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelRef.current) return;
          const t = Math.min((now - start) / dur, 1);
          // ease-out
          const ease = 1 - Math.pow(1 - t, 2);
          el.style.opacity = String(from + (to - from) * ease);
          if (t < 1) {
            const id = requestAnimationFrame(tick);
            rafIds.push(id);
          } else {
            resolve();
          }
        };
        const id = requestAnimationFrame(tick);
        rafIds.push(id);
      });

    // Kick off the animation sequence
    const start = async () => {
      // Wait a tick so the DOM is fully stable after append
      await new Promise((r) => requestAnimationFrame(r));

      if (isDark) {
        // ──→ LIGHT (Sunrise) ──
        // Phase 1: dawn mist 0→1 (700ms)
        run(warm, 0, 1, 700);

        // Phase 2: light spill 0→1 starts 400ms later (overlap)
        setTimeout(() => {
          run(cool, 0, 1, 900);
        }, 400);

        // Phase 3: toggle + both fade out
        setTimeout(() => {
          Promise.all([run(warm, 1, 0, 500), run(cool, 1, 0, 500)]).then(
            () => {
              warm.remove();
              cool.remove();
              onDone();
            }
          );
          onToggle();
        }, 1500);
      } else {
        // ──→ DARK (Sunset) ──
        // Phase 1: sunset 0→1 (550ms)
        run(warm, 0, 1, 550);

        // Phase 2: night takes over — warm 1→0, cool 0→1
        setTimeout(() => {
          run(warm, 1, 0, 500);
          run(cool, 0, 1, 650);
        }, 600);

        // Phase 3: toggle + night 1→0
        setTimeout(() => {
          run(cool, 1, 0, 500).then(() => {
            warm.remove();
            cool.remove();
            onDone();
          });
          onToggle();
        }, 1600);
      }
    };

    start();

    return () => {
      cancelRef.current = true;
      rafIds.forEach((id) => cancelAnimationFrame(id));
      warm.remove();
      cool.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

const ThemeLens = memo(ThemeLensInner);
export default ThemeLens;
