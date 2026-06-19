import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Nav() {
  const { pathname } = useLocation();
  const { dark, toggle } = useTheme();
  const { lang, toggleLang, t } = useLanguage();

  const NAV_LINKS = [
    { to: "/", label: t("nav", "home") },
    { to: "/work", label: t("nav", "work") },
    { to: "/travel", label: t("nav", "travel") },
    { to: "/journal", label: t("nav", "journal") },
    { to: "/about", label: t("nav", "about") },
    { to: "/contact", label: t("nav", "contact") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container-main">
        <nav className="flex items-center justify-between h-20 md:h-24 border-b border-dashed border-[var(--color-border)]">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl md:text-2xl font-bold tracking-tight hover:text-[var(--color-accent)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)] text-xs font-bold"
                style={{ boxShadow: "0 0 20px rgba(126, 184, 247, 0.3)" }}
              >
                &#9674;
              </span>
              <span className="font-display text-[var(--color-text)]">PERSONAL</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium tracking-wide transition-all duration-300 ${
                  pathname === link.to
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {pathname === link.to && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--color-accent)] rounded-full" />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="glass-btn flex items-center justify-center w-11 h-11 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              aria-label="Toggle language"
            >
              <span className="font-mono">{t("language", "toggle")}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="glass-btn relative flex items-center justify-center w-11 h-11 rounded-xl"
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4">
                <Moon
                  className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${
                    dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
                  }`}
                  strokeWidth={1.5}
                />
                <Sun
                  className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${
                    dark ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
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
