import { useState } from "react"
import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import { apiPost } from "../api/client"
import SquigglyUnderline from "../components/SquigglyUnderline";
import { useLanguage } from "../contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await apiPost("/api/messages", { name, email, message: msg });
      setName(""); setEmail(""); setMsg("");
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

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
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{t("contact","name")}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 glass-input text-sm"
                          style={{ borderRadius: "12px" }}
                          value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact","namePlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{t("contact","email")}</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 glass-input text-sm"
                          style={{ borderRadius: "12px" }}
                          value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("contact","emailPlaceholder")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{t("contact","message")}</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 glass-input text-sm resize-none"
                        style={{ borderRadius: "12px" }}
                        value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t("contact","messagePlaceholder")}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all"
                    >
                      {t("contact","send")}`n                    {status === "done" && <p className="mt-3 text-xs text-green-400 text-center">消息已发送！</p>}`n                    {status === "error" && <p className="mt-3 text-xs text-red-400 text-center">发送失败，请稍后再试</p>}
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


