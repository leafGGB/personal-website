import { motion } from "framer-motion";
import PageTransition from "../components/animations/PageTransition";
import ScrollReveal from "../components/animations/ScrollReveal";
import SquigglyUnderline from "../components/SquigglyUnderline";
import GlassMagneticCard from "../components/GlassMagneticCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTravelPosts } from "../api/travel";
import { fetchProjects } from "../api/projects";
import { fetchJournalPosts } from "../api/journal";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { t, lang } = useLanguage();
  const { data: travelPosts } = useQuery({
    queryKey: ["travel", "latest"],
    queryFn: () => fetchTravelPosts({ sort: "-date_visited" }),
  });
  const latestTravel = travelPosts?.[0];
  const { data: projects } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => fetchProjects({ featured: "true", sort: "-sort_order" }),
  });
  const latestProject = projects?.[0];
  const { data: journalPosts } = useQuery({
    queryKey: ["journal", "latest"],
    queryFn: () => fetchJournalPosts({ sort: "-created_at" }),
  });
  const latestJournal = journalPosts?.[0];

  return (
    <PageTransition>
      {/* HERO -- 60/40 Split */}
      <section className="relative min-h-[90dvh] flex items-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #7EB8F7 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #E8C4C4 0%, transparent 70%)" }} />
        <div className="container-main relative z-10 w-full">
          <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
            <div className="md:col-span-3">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mb-6">
                {t("home", "greeting")}
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-balance leading-[0.95]">
                {t("home", "creative")}<br />
                <span className="relative inline-block">
                  <span className="text-accent-gradient">{t("home", "developer")}</span>
                  <SquigglyUnderline />
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-8 max-w-md text-base text-[var(--color-text-secondary)] leading-relaxed">
                {t("home", "desc")}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-10 flex flex-wrap gap-4">
                <Link to="/work" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] font-medium text-sm hover:brightness-110 transition-all">
                  {t("home", "viewWork")}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/about" className="glass-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">
                  {t("home", "moreAbout")}
                </Link>
              </motion.div>
            </div>
            <div className="md:col-span-2">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="glass-card p-8 md:p-10" style={{ borderRadius: "24px" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  <span className="font-mono text-xs text-[var(--color-text-tertiary)] tracking-wider uppercase">Featured</span>
                </div>
                {latestProject ? (
                  <Link to={`/work/${latestProject.slug}`} className="block group">
                    <h3 className="font-display text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{latestProject.title}</h3>
                    <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">{latestProject.description}</p>
                    {latestProject.tech_stack?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {latestProject.tech_stack.slice(0, 3).map((tech: string) => (
                          <span key={tech} className="tag-pill text-[10px]">{tech}</span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[var(--color-accent)] group-hover:gap-2 transition-all">
                      {t("home", "viewProject")}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <p className="text-sm text-[var(--color-text-tertiary)]">{t("home", "noProjects")}</p>
                )}
                <div className="mt-6 pt-6 border-t border-[var(--color-glass-border)]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
                    <span className="font-mono">dev &bull; design &bull; create</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main"><hr className="glass-divider" /></div>

      {/* Latest Travel */}
      <section className="section-spacing pb-0">
        <div className="container-main">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)]">{t("home", "latestJourney")}</h2>
              <Link to="/travel" className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors glass-underline">{t("home", "allTravels")}</Link>
            </div>
          </ScrollReveal>
          {latestTravel ? (
            <ScrollReveal delay={0.1}>
              <GlassMagneticCard to={`/travel/${latestTravel.slug}`} className="p-8 md:p-10" style={{ borderRadius: "20px" }}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-[var(--color-accent)] tracking-wider">{latestTravel.location_name}</span>
                      {latestTravel.date_visited && <><span className="text-[var(--color-text-tertiary)]">&bull;</span><span className="font-mono text-xs text-[var(--color-text-tertiary)]">{latestTravel.date_visited}</span></>}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-text)] transition-colors">
                      {lang === "zh" && latestTravel.title_zh ? latestTravel.title_zh : latestTravel.title}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                      {lang === "zh" && latestTravel.description_zh ? latestTravel.description_zh : latestTravel.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden glass-card border-0 flex items-center justify-center">
                      {latestTravel.images[0] ? (
                        <img src={latestTravel.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono text-2xl text-[var(--color-accent)]">&map;</span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassMagneticCard>
            </ScrollReveal>
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)]">{t("home", "noTravels")}</p>
          )}
        </div>
      </section>

      {/* Latest Journal */}
      <section className="section-spacing">
        <div className="container-main">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)]">{t("home", "latestWritings")}</h2>
              <Link to="/journal" className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors glass-underline">{t("home", "viewAllWritings")}</Link>
            </div>
          </ScrollReveal>
          {latestJournal ? (
            <ScrollReveal delay={0.1}>
              <GlassMagneticCard to={`/journal/${latestJournal.slug}`} className="p-8 md:p-10" style={{ borderRadius: "20px" }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rosegold)]" />
                  <span className="font-mono text-xs text-[var(--color-text-tertiary)]">Journal</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-text)] transition-colors">
                  {lang === "zh" && latestJournal.title_zh ? latestJournal.title_zh : latestJournal.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 max-w-xl">
                  {lang === "zh" && latestJournal.description_zh ? latestJournal.description_zh : latestJournal.description}
                </p>
                {latestJournal.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {latestJournal.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                    ))}
                  </div>
                )}
              </GlassMagneticCard>
            </ScrollReveal>
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)]">{t("home", "noWritings")}</p>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
