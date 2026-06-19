import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import BackgroundParticles from "../BackgroundParticles";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../hooks/useTheme";

export default function Layout() {
  const mainRef = useRef<HTMLElement>(null);
  const { lang } = useLanguage();
  const { dark } = useTheme();

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
      <Nav />
      <main ref={mainRef} className="flex-1 pt-20 md:pt-24 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
