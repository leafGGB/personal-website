import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import TravelMap from "../components/TravelMap";
import GlassMagneticCard from "../components/GlassMagneticCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTravelPosts } from "../api/travel";
import type { TravelPost } from "../api/travel";
import { useLanguage } from "../contexts/LanguageContext";

export default function Travel() {
  const { t, lang } = useLanguage();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["travel"],
    queryFn: () => fetchTravelPosts({ sort: "-date_visited" }),
  });

  return (
    <PageTransition>
      <section className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("travel","subtitle")} &mdash; {posts?.length || 0} {t("travel","stops")}</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance">{t("travel","title")}</h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-10 glass-card overflow-hidden" style={{ borderRadius: "24px", padding: "8px" }}>
              <div className="h-[400px] md:h-[500px]" style={{ borderRadius: "20px", overflow: "hidden" }}>
                {posts && <TravelMap posts={posts} className="w-full h-full" />}
                {isLoading && <div className="w-full h-full glass-card animate-pulse" />}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-14 space-y-4">
              {posts && posts.length === 0 && (
                <p className="text-sm text-center text-[var(--color-text-tertiary)] py-12">{t("travel","empty")}</p>
              )}
              {posts?.map((post: TravelPost, i: number) => (
                <GlassMagneticCard key={post.id} to={`/travel/${post.slug}`}
                  className="flex items-start gap-5 p-6 md:p-8"
                  style={{ borderRadius: i % 2 === 0 ? "20px" : "16px" }}>
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden glass-card border-0 flex items-center justify-center"
                    style={{ borderRadius: i % 2 === 0 ? "16px" : "12px" }}>
                    {post.images[0] ? (
                      <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="font-mono text-lg text-[var(--color-accent)]">&map;</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-text)] transition-colors">
                        {lang === "zh" && post.title_zh ? post.title_zh : post.title}
                      </h3>
                      <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                        {lang === "zh" && post.location_name_zh ? post.location_name_zh : post.location_name}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                      {lang === "zh" && post.description_zh ? post.description_zh : post.description}
                    </p>
                    {post.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag: string) => (<span key={tag} className="tag-pill text-[10px]">{tag}</span>))}
                      </div>
                    )}
                  </div>
                </GlassMagneticCard>
              ))}
            </div>
          </ScrollReveal>

          <hr className="glass-divider mt-16" />
        </div>
      </section>
    </PageTransition>
  );
}
