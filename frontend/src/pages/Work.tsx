import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProjects } from "../api/projects";
import type { Project } from "../api/projects";
import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import GlassMagneticCard from "../components/GlassMagneticCard";
import { useLanguage } from "../contexts/LanguageContext";

export default function Work() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects({ sort: "-sort_order" }),
  });

  return (
    <PageTransition>
      <section className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <div className="max-w-xl mb-16 md:mb-20">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">{t("work","subtitle")}</p>
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance mt-2">{t("work","title")}</h1>
              <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">{t("work","desc")}</p>
            </div>
          </ScrollReveal>

          {isLoading && (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-8 animate-pulse h-80" />
              ))}
            </div>
          )}

          {projects && (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project: Project, i: number) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}>
                  <GlassMagneticCard to={`/work/${project.slug}`} className="block"
                    style={{ borderRadius: i % 3 === 0 ? "24px" : "16px" }}>
                    <div className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: "inherit inherit 0 0" }}>
                      {project.images[0] ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="font-mono text-xs text-[var(--color-text-tertiary)]">No image</span></div>
                      )}
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl font-bold text-[var(--color-text)] transition-colors">{project.title}</h3>
                        <svg className="w-4 h-4 flex-shrink-0 mt-1 text-[var(--color-text-tertiary)] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">{project.description}</p>
                      {project.tech_stack?.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tech_stack.map((tech: string) => (<span key={tech} className="tag-pill">{tech}</span>))}
                        </div>
                      )}
                    </div>
                  </GlassMagneticCard>
                </motion.div>
              ))}
            </div>
          )}

          {projects && projects.length === 0 && (
            <div className="text-center py-20"><p className="text-sm text-[var(--color-text-tertiary)]">{t("work","empty")}</p></div>
          )}

          <hr className="glass-divider mt-20" />
        </div>
      </section>
    </PageTransition>
  );
}
