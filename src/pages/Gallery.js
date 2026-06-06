import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "../components/Lightbox";
import ProjectImage from "../components/ProjectImage";
import SEO from "../components/SEO";
import { projects } from "../data/projects";

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const items = projects
    .filter((p) => filter === "all" || p.slug === filter)
    .flatMap((p) => (p.gallery || [p.preview || "/projects/fallback.svg"]).map((img) => ({ img, project: p })));

  return (
    <>
      <SEO
        title="Project Gallery"
        path="/gallery"
        description="Project screenshots and previews from Aditaya Kumar Mishra's full stack developer portfolio."
      />
      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">Project Gallery</span>
          <h1 className="page-title">All project screenshots and previews</h1>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-input max-w-full sm:w-auto" aria-label="Filter project gallery">
            <option value="all">All projects</option>
            {projects.map((p) => (
              <option value={p.slug} key={p.slug}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="gallery-grid">
          {items.map((item, i) => (
            <motion.button
              key={item.img + i}
              onClick={() => { setIndex(i); setOpen(true); }}
              type="button"
              aria-label={`Open ${item.project.title} screenshot ${i + 1}`}
              className="group card-safe rounded-2xl border border-slate-200/60 bg-white/80 text-left shadow-md transition hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <ProjectImage src={item.img} alt={`${item.project.title} screenshot`} className="aspect-video w-full h-48" />
              <div className="p-3">
                <strong className="block text-sm text-slate-950 dark:text-white">{item.project.title}</strong>
                <small className="text-xs text-slate-500 dark:text-slate-400">{item.project.category}</small>
              </div>
            </motion.button>
          ))}
        </div>

        <Lightbox images={items.map((i) => i.img)} index={index} open={open} onClose={() => setOpen(false)} />
      </section>
    </>
  );
}
