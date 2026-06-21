import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { Moon, Sun } from "lucide-react";

interface NavProps {
  dark: boolean;
  onThemeStart: () => void;
}

export default function Nav({ dark, onThemeStart }: NavProps) {
  const { pathname } = useLocation();
  const { lang, toggleLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);



  const NAV_LINKS = [
    { to: "/", label: t("nav", "home") },
    { to: "/work", label: t("nav", "work") },
    { to: "/travel", label: t("nav", "travel") },
    { to: "/journal", label: t("nav", "journal") },
    { to: "/about", label: t("nav", "about") },
    { to: "/contact", label: t("nav", "contact") },
  ];

  const s = scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        s ? "nav-glass" : ""
      }`}
    >
      <div className="container-main">
        <nav
          className={`flex items-center justify-between transition-all duration-300 ${
            s ? "h-16 md:h-20" : "h-28 md:h-32"
          } ${s ? "" : ""}`}
        >
          {/* Logo */}
          <Link
            to="/"
            className={`font-display font-bold tracking-tight hover:text-[var(--color-accent)] transition-colors ${
              s ? "text-sm md:text-base" : "text-2xl md:text-3xl"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)] font-bold transition-all duration-300 ${
                  s ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"
                }`}
                style={{ boxShadow: "0 0 20px rgba(126, 184, 247, 0.3)" }}
              >
                &#9674;
              </span>
              <span className="font-display text-[var(--color-text)]">
                PERSONAL
              </span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`droplet-btn ${s ? "!h-12 !px-6 text-xs lg:text-sm" : "!h-14 !px-7 text-sm lg:text-base"} ${active ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={toggleLang}
              className={`glass-btn flex items-center justify-center rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all duration-300 ${
                s ? "w-11 h-11 lg:w-12 lg:h-12" : "w-14 h-14 lg:w-16 lg:h-16"
              }`}
              aria-label="Toggle language"
            >
              <span className="font-mono text-xs lg:text-sm">
                {t("language", "toggle")}
              </span>
            </button>

            <button
              onClick={onThemeStart}
              className={`glass-btn relative flex items-center justify-center rounded-xl transition-all duration-300 ${
                s ? "w-11 h-11 lg:w-12 lg:h-12" : "w-14 h-14 lg:w-16 lg:h-16"
              }`}
              aria-label="Toggle theme"
            >
              <div
                className={`relative transition-all duration-300 ${
                  s
                    ? "w-4 h-4 lg:w-5 lg:h-5"
                    : "w-5 h-5 lg:w-6 lg:h-6"
                }`}
              >
                <Moon
                  className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                    dark
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-0"
                  }`}
                  strokeWidth={1.5}
                />
                <Sun
                  className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                    dark
                      ? "opacity-0 -rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}



