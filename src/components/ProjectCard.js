import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProjectImage from "./ProjectImage";
import { FiArrowUpRight, FiLayers } from "react-icons/fi";
import { trackEvent } from "../lib/analytics";

function ProjectCard({ project, featured = false }) {
  const hasExternalDemo = Boolean(project.live || project.github);

  return (
    <motion.article
      className={`group card-safe flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/85 text-slate-700 shadow-card backdrop-blur-xl transition-transform transform-gpu hover:-translate-y-1 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200 dark:shadow-card-dark ${
        featured ? "lg:col-span-2" : ""
      }`}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="relative min-h-56 overflow-hidden rounded-t-3xl p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl bg-slate-900">
          <ProjectImage
            src={project.preview || "/projects/fallback.svg"}
            alt={project.previewAlt || project.title}
            className="h-full w-full"
            imageClassName="relative z-10 h-full w-full object-cover transition duration-700"
            maxHeight="280px"
            sizes={featured ? "(min-width: 1280px) 66vw, (min-width: 1024px) 58vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"}
          />
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className="absolute inset-0 z-30 flex flex-col justify-between p-5 text-white">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-white/70" />
              <span className="h-3 w-3 rounded-full bg-white/40" />
              <span className="h-3 w-3 rounded-full bg-white/30" />
            </div>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <span className="text-xs font-black uppercase text-white/90">{project.category}</span>
              <strong className="text-left text-xl leading-tight sm:max-w-[12rem] sm:text-right">{project.title}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3 text-xs font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">
          <span>{project.category}</span>
          <span>{hasExternalDemo ? "Live" : "Case Study"}</span>
        </div>
        <h3 className="text-2xl font-black text-slate-950 dark:text-white">{project.title}</h3>
        <p className="mt-3 flex-1 leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.slice(0, 6).map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {/* Project card analytics are tracked on detail, live demo, and tech stack actions. */}
          <Link className="btn-primary w-full" to={`/projects/${project.slug}`} onClick={() => trackEvent("Projects", "Project Card Click", project.slug)}>
            Details <FiArrowUpRight />
          </Link>
          {hasExternalDemo ? (
            <a
              className="btn-secondary w-full"
              href={project.live || project.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("Projects", "Live Demo Click", project.slug)}
            >
              Live Demo <FiArrowUpRight />
            </a>
          ) : (
            <button className="btn-secondary w-full opacity-70" type="button" disabled>
              Coming Soon
            </button>
          )}
          <Link className="btn-secondary w-full sm:col-span-2" to={`/projects/${project.slug}`} onClick={() => trackEvent("Projects", "Project Card Click", `${project.slug}:tech-stack`)}>
            Tech Stack <FiLayers />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
