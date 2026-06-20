import { Outlet } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import BackgroundParticles from "../BackgroundParticles";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../hooks/useTheme";

function run(
  el: HTMLElement,
  from: number,
  to: number,
  dur: number
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - (1 - t) * (1 - t); // ease-out
      el.style.opacity = String(from + (to - from) * ease);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export default function Layout() {
  const mainRef = useRef<HTMLElement>(null);
  const { lang } = useLanguage();
  const { dark, toggle } = useTheme();

  const handleThemeStart = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const warm = document.createElement("div");
    const cool = document.createElement("div");
    const base = "position:fixed;inset:0;pointer-events:none;opacity:0;";

    if (isDark) {
      warm.style.cssText =
        base +
        "z-index:9999;background:radial-gradient(ellipse 130% 80% at 50% 100%, rgba(180,210,245,0.45) 0%, rgba(160,190,230,0.25) 35%, rgba(140,175,215,0.1) 60%, transparent 80%)";
      cool.style.cssText =
        base +
        "z-index:9998;background:linear-gradient(180deg, rgba(255,248,235,0.35) 0%, rgba(255,235,210,0.15) 30%, transparent 60%)";
    } else {
      warm.style.cssText =
        base +
        "z-index:9999;background:radial-gradient(ellipse 110% 65% at 50% 100%, rgba(255,190,110,0.35) 0%, rgba(230,140,175,0.25) 25%, rgba(150,110,200,0.15) 50%, transparent 75%)";
      cool.style.cssText =
        base +
        "z-index:9998;background:radial-gradient(ellipse 110% 70% at 50% 50%, rgba(18,30,65,0.35) 0%, rgba(12,18,35,0.2) 50%, transparent 80%)";
    }

    document.body.append(warm, cool);

    const cleanup = () => {
      warm.remove();
      cool.remove();
    };

    requestAnimationFrame(async () => {
      if (isDark) {
        // ── Sunrise ──
        run(warm, 0, 1, 700);
        setTimeout(() => run(cool, 0, 1, 900), 400);
        setTimeout(() => {
          // 1. Toggle FIRST while overlay is fully opaque
          toggle();
          // 2. Wait ~2 frames for repaint to settle
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // 3. Now fade out — no repaint happening
              Promise.all([run(warm, 1, 0, 500), run(cool, 1, 0, 500)]).then(
                cleanup
              );
            });
          });
        }, 1500);
      } else {
        // ── Sunset ──
        run(warm, 0, 1, 550);
        setTimeout(() => {
          run(warm, 1, 0, 500);
          run(cool, 0, 1, 650);
        }, 600);
        setTimeout(() => {
          // 1. Toggle FIRST while overlay is fully opaque
          toggle();
          // 2. Wait ~2 frames for repaint to settle
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // 3. Now fade out — no repaint happening
              run(cool, 1, 0, 500).then(cleanup);
            });
          });
        }, 1600);
      }
    });
  }, [toggle]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const el = mainRef.current;
    if (el) {
      el.classList.remove("content-fade-in");
      void el.offsetWidth;
      el.classList.add("content-fade-in");
    }
  }, [lang, dark]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundParticles />
      <Nav dark={dark} onThemeStart={handleThemeStart} />
      <main ref={mainRef} className="flex-1 pt-20 md:pt-24 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
