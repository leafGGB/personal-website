import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import GlassMagneticCard from "../components/GlassMagneticCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchJournalPosts } from "../api/journal";
import type { JournalPost } from "../api/journal";
import { useLanguage } from "../contexts/LanguageContext";

export default function Journal() {
  const { t, lang } = useLanguage();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["journal"],
    queryFn: () => fetchJournalPosts({ sort: "-created_at" }),
  });

  return (
    <PageTransition>
      <section className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("journal","subtitle")}</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance">{t("journal","title")}</h1>
            <p className="mt-4 max-w-lg text-sm text-[var(--color-text-secondary)] leading-relaxed">{t("journal","desc")}</p>
          </ScrollReveal>

          {isLoading && (
            <div className="mt-14 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-8 animate-pulse" style={{ borderRadius: i % 2 === 0 ? "20px" : "16px" }} />
              ))}
            </div>
          )}

          {posts && posts.length === 0 && (
            <ScrollReveal delay={0.1}>
              <div className="mt-14 text-center py-16 glass-card" style={{ borderRadius: "24px" }}>
                <p className="text-sm text-[var(--color-text-tertiary)]">{t("journal","comingSoon")}</p>
              </div>
            </ScrollReveal>
          )}

          {posts && posts.length > 0 && (
            <div className="mt-14 space-y-4">
              {posts.map((post: JournalPost, i: number) => {
                const title = lang === "zh" && post.title_zh ? post.title_zh : post.title;
                const desc = lang === "zh" && post.description_zh ? post.description_zh : post.description;
                return (
                  <GlassMagneticCard key={post.id} to={`/journal/${post.slug}`}
                    className="flex items-start gap-5 p-6 md:p-8"
                    style={{ borderRadius: i % 2 === 0 ? "20px" : "16px" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rosegold)]" />
                        <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-text)] transition-colors">{title}</h3>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">{desc}</p>
                      {post.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.map((tag: string) => (<span key={tag} className="tag-pill text-[10px]">{tag}</span>))}
                        </div>
                      )}
                    </div>
                  </GlassMagneticCard>
                );
              })}
            </div>
          )}

          <hr className="glass-divider mt-20" />
        </div>
      </section>
    </PageTransition>
  );
}
