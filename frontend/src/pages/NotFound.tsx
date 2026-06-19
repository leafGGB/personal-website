import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import PageTransition from "../components/animations/PageTransition";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("notFound","oops")}</p>
          <h1 className="font-display text-8xl md:text-9xl font-bold tracking-tight">
            <span className="text-accent-gradient">404</span>
          </h1>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{t("notFound","title")}</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-btn text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t("notFound","back")}
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
