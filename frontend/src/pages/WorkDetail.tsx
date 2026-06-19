import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../api/projects";
import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import { useLanguage } from "../contexts/LanguageContext";

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProject(slug!),
    enabled: !!slug,
  });

  if (isLoading) return (
    <PageTransition>
      <div className="section-spacing"><div className="container-main">
        <div className="space-y-6 max-w-3xl animate-pulse">
          <div className="h-6 w-32 glass-card p-4" />
          <div className="h-16 w-3/4 glass-card p-8" />
          <div className="h-96 glass-card" style={{ borderRadius: "24px" }} />
        </div>
      </div></div>
    </PageTransition>
  );

  if (error || !project) return (
    <PageTransition>
      <div className="section-spacing"><div className="container-main text-center pt-16">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("workDetail","oops")}</p>
        <h2 className="font-display text-4xl font-bold">{t("workDetail","notFound")}</h2>
        <Link to="/work" className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t("workDetail","back")}
        </Link>
      </div></div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <article className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <Link to="/work" className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span className="font-medium">{t("workDetail","back")}</span>
            </Link>
          </ScrollReveal>

          <div className="grid md:grid-cols-5 gap-10 md:gap-16 mt-10">
            <div className="md:col-span-3">
              <ScrollReveal>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1]">{project.title}</h1>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="mt-6 text-base text-[var(--color-text-secondary)] leading-relaxed">{project.description}</p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tech_stack.map((tech: string) => (<span key={tech} className="tag-pill">{tech}</span>))}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-xs font-medium hover:brightness-110 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {t("workDetail","liveSite")}
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="glass-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      {t("workDetail","sourceCode")}
                    </a>
                  )}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <div className="mt-10 space-y-4">
                  {project.content.split("\n").map((para: string, i: number) => (
                    <p key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{para}</p>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            <div className="md:col-span-2 space-y-6">
              {project.images?.length > 0 && (
                <ScrollReveal delay={0.15}>
                  <div className="space-y-6">
                    {project.images.map((img: string, i: number) => (
                      <div key={i} className="glass-card overflow-hidden" style={{ borderRadius: i % 2 === 0 ? "20px" : "16px" }}>
                        <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-auto" />
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
