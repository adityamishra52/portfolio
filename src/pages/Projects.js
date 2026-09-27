import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import ProjectImage from "../components/ProjectImage";
import Reveal, { EASE_OUT } from "../components/Reveal";
import AnimatedWords from "../components/AnimatedWords";
import CountUp from "../components/CountUp";
import { projects } from "../data/projects";
import { trackEvent } from "../lib/analytics";

const isLiveDeployment = (project) => Boolean(project.live) && !project.live.includes("github.com");
const isAiProduct = (project) => project.category.includes("AI");

const projectFilters = [
  { key: "all", label: "All Projects", match: () => true },
  { key: "ai", label: "AI Products", match: isAiProduct },
  {
    key: "impact",
    label: "Community & Impact",
    match: (project) => ["Community Impact Platform", "Donation Platform"].includes(project.category),
  },
  { key: "ml", label: "Machine Learning", match: (project) => project.category === "Machine Learning" },
];

const projectStats = [
  { to: projects.length, label: "projects built" },
  { to: projects.filter(isLiveDeployment).length, label: "live deployments" },
  { to: projects.filter(isAiProduct).length, label: "AI products" },
];

const headerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

const headerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleProjects = useMemo(() => {
    const filter = projectFilters.find((item) => item.key === activeFilter) || projectFilters[0];
    return projects.filter(filter.match);
  }, [activeFilter]);

  const handleFilter = (key) => {
    setActiveFilter(key);
    trackEvent("Projects", "Filter Click", key);
  };

  return (
    <>
      <SEO
        title="Aditaya Projects"
        path="/projects"
        description="Featured projects by Aditaya Kumar Mishra including BoostPilot AI, OptiResume, Portfolio Builder, Care Contribution, CharityVibe, and Stock Market Prediction ML."
        keywords={["Aditaya projects", "Aditaya portfolio projects", "Aditaya Kumar Mishra projects", "Aditaya MERN projects", "Aditaya AI projects"]}
      />
      <section className="page-section">
        <motion.div variants={headerContainer} initial="hidden" animate="visible">
          <div className="section-heading mb-10">
            <motion.span variants={headerItem} className="eyebrow">
              Featured Projects
            </motion.span>
            <h1 className="page-title">
              <AnimatedWords text="Aditaya Kumar Mishra projects: six production-style builds with clean UX and real impact" />
            </h1>
            <motion.p variants={headerItem} className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Each project demonstrates full-stack capabilities: responsive design, backend APIs, database integration, and deployment. Production-ready code with recruiter-friendly architecture.
            </motion.p>
          </div>

          <motion.div variants={headerItem} className="grid grid-cols-3 gap-2 sm:gap-3">
            {projectStats.map((stat) => (
              <div
                key={stat.label}
                className="spotlight min-w-0 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:rounded-3xl sm:p-5"
              >
                <strong className="block text-3xl font-black sm:text-4xl">
                  <span className="text-gradient-animated">
                    <CountUp to={stat.to} />
                  </span>
                </strong>
                <span className="mt-1 block text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={headerItem}
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter projects by category"
          >
            {projectFilters.map((filter) => {
              const isActive = filter.key === activeFilter;
              const count = projects.filter(filter.match).length;

              return (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFilter(filter.key)}
                  className={`relative isolate inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/30 ${
                    isActive
                      ? "border-transparent text-white dark:text-slate-950"
                      : "border-slate-200/80 bg-white/70 text-slate-600 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-filter-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-slate-950 shadow-soft dark:bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {filter.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive ? "bg-white/20 dark:bg-slate-950/10" : "bg-slate-200/70 dark:bg-white/10"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* popLayout takes exiting cards out of flow immediately, so the remaining
            cards glide into their new grid slots instead of waiting for the exit. */}
        <div className="relative mt-10 grid items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout="position"
                className={index === 0 ? "lg:col-span-2" : ""}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE_OUT },
                }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ layout: { duration: 0.45, ease: EASE_OUT } }}
              >
                <ProjectCard project={project} featured={index === 0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-20">
          <Reveal className="section-heading">
            <span className="eyebrow">Visual Overview</span>
            <h2>Quick visual reference for each project</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: EASE_OUT }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/40 dark:shadow-card-dark"
                  onClick={() => trackEvent("Projects", "Project Card Click", `${project.slug}:visual-overview`)}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <ProjectImage
                      src={project.preview || "/projects/fallback.svg"}
                      alt={project.previewAlt || project.title}
                      className="h-full w-full"
                      imageClassName="relative z-10 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition duration-500 group-hover:from-black/75" />
                    <span className="absolute right-4 top-4 z-30 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/90 text-slate-950 opacity-0 shadow-soft transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <FiArrowUpRight aria-hidden="true" />
                    </span>
                    <div className="absolute inset-0 z-30 flex flex-col justify-end p-6">
                      <span className="text-xs font-black uppercase text-white/75">{project.category}</span>
                      <strong className="mt-3 block text-2xl leading-tight text-white">{project.title}</strong>
                      <p className="mt-3 text-sm leading-relaxed text-white/90">{project.highlights[0]}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;
