import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import ProjectImage from "../components/ProjectImage";
import { projects } from "../data/projects";
import { trackEvent } from "../lib/analytics";

function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <SEO
        title="Projects"
        path="/projects"
        description="Featured projects by Aditaya Kumar Mishra including BoostPilot AI, OptiResume, Care Contribution, CharityVibe, and Stock Market Prediction ML."
      />
      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">Featured Projects</span>
          <h1 className="page-title">Five production-style builds with clean UX and real impact</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Each project demonstrates full-stack capabilities: responsive design, backend APIs, database integration, and deployment. Production-ready code with recruiter-friendly architecture.
          </p>
        </div>

        <motion.div
          className="grid items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project, index) => (
            <motion.div key={project.slug} variants={cardVariants} className={index === 0 ? "lg:col-span-2" : ""}>
              <ProjectCard project={project} featured={index === 0} />
            </motion.div>
          ))}
        </motion.div>

        {/* Project showcase gallery */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-heading">
            <span className="eyebrow">Visual Overview</span>
            <h2>Quick visual reference for each project</h2>
          </div>
          <motion.div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-card transition hover:-translate-y-1 dark:shadow-card-dark"
                  onClick={() => trackEvent("Projects", "Project Card Click", `${project.slug}:visual-overview`)}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <ProjectImage
                      src={project.preview || "/projects/fallback.svg"}
                      alt={project.previewAlt || project.title}
                      className="h-full w-full"
                      imageClassName="relative z-10 h-full w-full object-cover transition duration-700"
                      sizes="(min-width: 1280px) 20vw, (min-width: 768px) 45vw, 100vw"
                    />
                    <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute inset-0 z-30 flex flex-col justify-end p-6">
                      <span className="text-xs font-black uppercase text-white/75">{project.category}</span>
                      <strong className="mt-3 block text-2xl leading-tight text-white">{project.title}</strong>
                      <p className="mt-3 text-sm leading-relaxed text-white/90">{project.highlights[0]}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default Projects;
