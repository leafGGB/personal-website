import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTravelPost } from "../api/travel";
import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import TravelMap from "../components/TravelMap";
import { useLanguage } from "../contexts/LanguageContext";

export default function TravelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["travel", slug],
    queryFn: () => fetchTravelPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) return (
    <PageTransition>
      <div className="section-spacing"><div className="container-main">
        <div className="space-y-6 max-w-3xl animate-pulse">
          <div className="h-6 w-32 glass-card p-4" />
          <div className="h-12 w-3/4 glass-card p-8" />
          <div className="h-[300px] glass-card" style={{ borderRadius: "24px" }} />
        </div>
      </div></div>
    </PageTransition>
  );

  if (error || !post) return (
    <PageTransition>
      <div className="section-spacing"><div className="container-main text-center pt-16">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("travelDetail","oops")}</p>
        <h2 className="font-display text-4xl font-bold">{t("travelDetail","notFound")}</h2>
        <Link to="/travel" className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t("travelDetail","back")}
        </Link>
      </div></div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <article className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <Link to="/travel" className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span className="font-medium">{t("travelDetail","back")}</span>
            </Link>
          </ScrollReveal>

          <div className="grid md:grid-cols-5 gap-10 md:gap-16 mt-10">
            <div className="md:col-span-3">
              <ScrollReveal>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1]">
                  {lang === "zh" && post.title_zh ? post.title_zh : post.title}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] tracking-wider">
                    {lang === "zh" && post.location_name_zh ? post.location_name_zh : post.location_name}
                  </span>
                  <span className="text-[var(--color-text-tertiary)]">&bull;</span>
                  {post.date_visited && <span className="font-mono text-xs text-[var(--color-text-tertiary)]">{post.date_visited}</span>}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="mt-6 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                  {lang === "zh" && post.description_zh ? post.description_zh : post.description}
                </p>
              </ScrollReveal>
              {post.tags?.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (<span key={tag} className="tag-pill">{tag}</span>))}
                  </div>
                </ScrollReveal>
              )}
              <ScrollReveal delay={0.25}>
                <div className="mt-10 max-w-xl space-y-4">
                  {(lang === "zh" && post.content_zh ? post.content_zh : post.content).split("\n").map((para: string, i: number) => (
                    <p key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{para}</p>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            <div className="md:col-span-2 space-y-6">
              <ScrollReveal delay={0.15}>
                <div className="glass-card overflow-hidden" style={{ borderRadius: "20px", padding: "6px" }}>
                  <div className="h-56" style={{ borderRadius: "16px", overflow: "hidden" }}>
                    <TravelMap posts={[post]} highlightedSlug={post.slug} className="w-full h-full" />
                  </div>
                </div>
              </ScrollReveal>
              {post.images?.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="space-y-4">
                    {post.images.map((img: string, i: number) => (
                      <div key={i} className="glass-card overflow-hidden" style={{ borderRadius: i % 2 === 0 ? "20px" : "16px" }}>
                        <img src={img} alt={`${post.title} ${i + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>

          <hr className="glass-divider mt-20" />
        </div>
      </article>
    </PageTransition>
  );
}
