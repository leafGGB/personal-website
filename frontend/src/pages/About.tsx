import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import SquigglyUnderline from "../components/SquigglyUnderline";
import { useLanguage } from "../contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <section className="section-spacing">
        <div className="container-main">
          <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
            <div className="md:col-span-3">
              <ScrollReveal>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("about","subtitle")}</p>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[0.95] relative inline-block">
                  {t("about","title")}
                  <SquigglyUnderline />
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="mt-8 space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                  <p>{t("about","para1")}</p>
                  <p>{t("about","para2")}</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15}>
              <div className="glass-card flex items-center justify-center aspect-square" style={{ borderRadius: "24px" }}>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--color-accent-soft)] flex items-center justify-center mb-4">
                    <span className="font-display text-3xl text-[var(--color-accent)]">&#9674;</span>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-text-tertiary)]">{t("about","photo")}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <hr className="glass-divider mt-20" />
        </div>
      </section>
    </PageTransition>
  );
}
