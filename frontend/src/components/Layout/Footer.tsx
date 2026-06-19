import { Github, Mail } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-[var(--color-glass-border)]">
      <div className="container-main py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-xl bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)] text-sm font-bold opacity-60"
              style={{ boxShadow: "0 0 20px rgba(126, 184, 247, 0.15)" }}
            >
              &#9674;
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              &copy; {new Date().getFullYear()} PERSONAL &middot; {t("footer","text")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn flex items-center justify-center w-10 h-10 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                aria-label={label}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
