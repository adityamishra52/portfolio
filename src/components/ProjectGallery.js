import { motion } from "framer-motion";
import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { profile, projects } from "../data/portfolio";
import Lightbox from "./Lightbox";
import ProjectImage from "./ProjectImage";

function ProjectGallery() {
  return (
    <motion.section
      id="gallery"
      className="section-shell gallery-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.16 }}
    >
      <div className="section-heading">
        <span className="section-kicker">Project preview gallery</span>
        <h2>Visual showcase of all featured projects and their implementations.</h2>
      </div>

      <div className="space-y-12">
        {projects.map((project, projectIndex) => (
          <div key={project.slug} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{project.title}</h3>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{project.category}</p>
              </div>
              <a
                className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2 font-semibold text-teal-700 transition hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
                href={project.live || project.github || `mailto:${profile.email}`}
                target={project.live || project.github ? "_blank" : undefined}
                rel={project.live || project.github ? "noreferrer" : undefined}
              >
                View Project <FiExternalLink className="text-lg" />
              </a>
            </div>
            
            <GalleryGrid project={project} />
          </div>
        ))}
      </div>
      
    </motion.section>
  );
}

export default ProjectGallery;

function GalleryGrid({ project }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {(project.gallery || []).map((image, idx) => (
                <motion.button
                  key={`${project.slug}-${idx}`}
                  onClick={() => { setIndex(idx); setOpen(true); }}
                  className="gallery-card group relative min-h-64 overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-card transition hover:-translate-y-1 dark:border-white/10 dark:bg-slate-800 dark:shadow-card-dark"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ProjectImage src={image} alt={idx === 0 ? project.previewAlt || `${project.title} preview` : `${project.title} screenshot ${idx + 1}`} className="h-full w-full" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <div className="text-white">
                      <p className="text-sm font-bold">{project.title}</p>
                      <p className="text-xs font-semibold text-slate-200">{project.type}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <Lightbox images={project.gallery || [project.preview]} index={index} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
