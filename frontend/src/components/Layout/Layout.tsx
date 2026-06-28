import { Outlet } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import BackgroundParticles from "../BackgroundParticles";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../hooks/useTheme";

export default function Layout() {
  const rafRef = useRef<number>();
  const lightRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const transitioningRef = useRef(false);
  const { lang } = useLanguage();
  const { dark, toggle } = useTheme();

      const handleThemeStart = useCallback(() => {
    toggle();
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

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        if (lightRef.current) {
          lightRef.current.style.setProperty("--lx", `${x}%`);
          lightRef.current.style.setProperty("--ly", `${y}%`);
        }
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundParticles />
      <div ref={lightRef} className="light-source" />
      <Nav dark={dark} onThemeStart={handleThemeStart} />
      <main ref={mainRef} className="flex-1 pt-20 md:pt-24 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}