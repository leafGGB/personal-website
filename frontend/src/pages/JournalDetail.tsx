import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJournalPost } from "../api/journal";
import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import { useLanguage } from "../contexts/LanguageContext";

export default function JournalDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["journal", slug],
    queryFn: () => fetchJournalPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) return (
    <PageTransition>
      <div className="section-spacing"><div className="container-main">
        <div className="space-y-6 max-w-3xl animate-pulse">
          <div className="h-6 w-32 glass-card p-4" />
          <div className="h-12 w-3/4 glass-card p-8" />
          <div className="h-4 w-full glass-card p-4" />
        </div>
      </div></div>
    </PageTransition>
  );

  if (error || !post) return (
    <PageTransition>
      <div className="section-spacing"><div className="container-main text-center pt-16">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("notFound","oops")}</p>
        <h2 className="font-display text-4xl font-bold">{t("notFound","title")}</h2>
        <Link to="/journal" className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>{t("journal","subtitle")}</span>
        </Link>
      </div></div>
    </PageTransition>
  );

  const title = lang === "zh" && post.title_zh ? post.title_zh : post.title;
  const content = lang === "zh" && post.content_zh ? post.content_zh : post.content;
  const desc = lang === "zh" && post.description_zh ? post.description_zh : post.description;

  return (
    <PageTransition>
      <article className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <Link to="/journal" className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span className="font-medium">{t("journal","subtitle")}</span>
            </Link>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto mt-10">
            <ScrollReveal>
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance leading-[1.05]">{title}</h1>
            </ScrollReveal>
            {post.tags?.length > 0 && (
              <ScrollReveal delay={0.1}>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (<span key={tag} className="tag-pill">{tag}</span>))}
                </div>
              </ScrollReveal>
            )}
            <ScrollReveal delay={0.15}>
              <p className="mt-8 text-base text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-10 space-y-4">
                {content.split("\n").map((para: string, i: number) => (
                  <p key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{para}</p>
                ))}
              </div>
            </ScrollReveal>
            {post.images?.length > 0 && (
              <ScrollReveal delay={0.25}>
                <div className="mt-10 space-y-4">
                  {post.images.map((img: string, i: number) => (
                    <div key={i} className="glass-card overflow-hidden" style={{ borderRadius: i % 2 === 0 ? "20px" : "16px" }}>
                      <img src={img} alt={`${title} ${i + 1}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          <hr className="glass-divider mt-20" />
        </div>
      </article>
    </PageTransition>
  );
}
