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
  const linkRefs = useRef<Map<number, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const tilt = useCallback((index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = linkRefs.current.get(index);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * -2; // 1..-1
    el.style.transform = `perspective(600px) rotateX(${py * 7}deg) rotateY(${px * 7}deg)`;
  }, []);

  const reset = useCallback((index: number) => {
    const el = linkRefs.current.get(index);
    if (!el) return;
    el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg)`;
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
            s ? "h-14 md:h-16" : "h-20 md:h-24"
          } ${s ? "" : "border-b border-dashed border-[var(--color-border)]"}`}
        >
          {/* Logo */}
          <Link
            to="/"
            className={`font-display font-bold tracking-tight hover:text-[var(--color-accent)] transition-colors ${
              s ? "text-sm md:text-base" : "text-xl md:text-2xl"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)] font-bold transition-all duration-300 ${
                  s ? "w-5 h-5 text-[9px]" : "w-6 h-6 text-xs"
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
            {NAV_LINKS.map((link, i) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  ref={(el) => {
                    if (el) linkRefs.current.set(i, el);
                    else linkRefs.current.delete(i);
                  }}
                  onMouseMove={(e) => tilt(i, e)}
                  onMouseLeave={() => reset(i)}
                  className={`
                    group prism-link relative px-3 py-1.5 lg:px-4 lg:py-2
                    transition-all duration-300
                    ${s ? "text-[11px] lg:text-xs" : "text-xs lg:text-sm"}
                    font-medium tracking-wide
                    ${active ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}
                    ${active ? "is-active" : ""}
                  `}
               >
                  <span className="echo-ring" />
                  {/* Text */}
                  <span
                    className="relative z-10 dew-text"
                    style={{ transform: "translateZ(4px)" }}
                  >
                    {link.label}
                  </span>
                  {/* Active indicator */}
                  {active && (
                    <span
                      className={`absolute -bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-[1.5px] bg-[var(--color-accent)] rounded-full transition-all duration-300 ${
                        s ? "opacity-40" : "opacity-70"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={toggleLang}
              className={`glass-btn flex items-center justify-center rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all duration-300 ${
                s ? "w-8 h-8 lg:w-9 lg:h-9" : "w-10 h-10 lg:w-11 lg:h-11"
              }`}
              aria-label="Toggle language"
            >
              <span className="font-mono text-[10px] lg:text-xs">
                {t("language", "toggle")}
              </span>
            </button>

            <button
              onClick={onThemeStart}
              className={`glass-btn relative flex items-center justify-center rounded-xl transition-all duration-300 ${
                s ? "w-8 h-8 lg:w-9 lg:h-9" : "w-10 h-10 lg:w-11 lg:h-11"
              }`}
              aria-label="Toggle theme"
            >
              <div
                className={`relative transition-all duration-300 ${
                  s
                    ? "w-3 h-3 lg:w-3.5 lg:h-3.5"
                    : "w-3.5 h-3.5 lg:w-4 lg:h-4"
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

