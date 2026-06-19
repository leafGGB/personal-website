import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import SquigglyUnderline from "../components/SquigglyUnderline";
import { useLanguage } from "../contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <section className="section-spacing">
        <div className="container-main">
          <div className="grid md:grid-cols-5 gap-12 md:gap-16">
            <div className="md:col-span-2">
              <ScrollReveal>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">
                  {t("contact","subtitle")}
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-balance leading-[0.95] relative inline-block">
                  {t("contact","title")}
                  <SquigglyUnderline />
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="mt-6 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
                  {t("contact","desc")}
                </p>
              </ScrollReveal>
            </div>

            <div className="md:col-span-3">
              <ScrollReveal delay={0.15}>
                <div className="glass-card p-8 md:p-10" style={{ borderRadius: "24px" }}>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{t("contact","name")}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 glass-input text-sm"
                          style={{ borderRadius: "12px" }}
                          placeholder={t("contact","namePlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{t("contact","email")}</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 glass-input text-sm"
                          style={{ borderRadius: "12px" }}
                          placeholder={t("contact","emailPlaceholder")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{t("contact","message")}</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 glass-input text-sm resize-none"
                        style={{ borderRadius: "12px" }}
                        placeholder={t("contact","messagePlaceholder")}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all"
                    >
                      {t("contact","send")}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <hr className="glass-divider mt-20" />
        </div>
      </section>
    </PageTransition>
  );
}
