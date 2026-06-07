import { motion } from "framer-motion";
import { FiExternalLink, FiLayers } from "react-icons/fi";
import { projects } from "../data/projects";

function ProjectPreview({ project }) {
  return (
    <div className={`project-preview preview-${project.visual}`} aria-hidden="true">
      <div className="preview-topbar">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="preview-body">
        <div className="preview-chart"></div>
        <div className="preview-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="preview-footer">
        <span>{project.metrics[0]}</span>
        <strong>{project.title}</strong>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <motion.section
      id="projects"
      className="section-shell"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.16 }}
    >
      <div className="section-heading wide-heading">
        <span className="section-kicker">Featured projects</span>
        <h2>Live products, AI tools, donation systems, and data projects.</h2>
        <p>
          Each card is built to be easy for recruiters and clients to scan: what it does, where it lives, and the stack
          behind it.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.article
            className={`project-card ${index < 2 ? "featured" : ""}`}
            key={project.title}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <ProjectPreview project={project} />

            <div className="project-content">
              <div className="project-topline">
                <span>{project.type}</span>
                <strong>{project.badgeLabel || (project.live ? "Live Project" : "Case Study")}</strong>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="project-metrics">
                {project.metrics.map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>
            </div>

            <div className="project-actions">
              {project.live ? (
                <a className="btn secondary" href={project.live} target="_blank" rel="noreferrer">
                  Live Demo <FiExternalLink />
                </a>
              ) : (
                <button className="btn secondary muted-button" type="button" disabled>
                  Case Study
                </button>
              )}

              <details className="tech-details">
                <summary>
                  <FiLayers /> Tech Stack
                </summary>
                <div className="tag-list compact">
                  {project.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </details>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default Projects;
