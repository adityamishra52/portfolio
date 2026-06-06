import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import SEO from "../components/SEO";
import { getProjectBySlug } from "../data/projects";
import { siteUrl, profile } from "../data/portfolio";
import Lightbox from "../components/Lightbox";
import ProjectImage from "../components/ProjectImage";

const TECH_STACK_GROUPS = [
  {
    title: "Frontend",
    match: ["React", "Vite", "TypeScript", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Backend",
    match: ["Node.js", "Express", "REST API", "REST APIs", "API Integration"],
  },
  {
    title: "Database",
    match: ["MongoDB", "GridFS", "MySQL"],
  },
  {
    title: "Authentication",
    match: ["JWT", "Email/OTP", "OTP"],
  },
  {
    title: "AI & Data",
    match: ["AI API", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "Data Analysis", "Predictive Modeling", "Python"],
  },
  {
    title: "Platform & Delivery",
    match: ["Vercel", "Render", "Admin Dashboard", "Admin Panel", "Image Upload", "Donation Flow", "PDF/DOCX generation"],
  },
];

function ProjectDetails() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!project) {
    return (
      <section className="page-section">
        <h1 className="page-title">Project not found</h1>
        <Link className="btn-primary mt-8" to="/projects">
          Back to Projects
        </Link>
      </section>
    );
  }

  const previewImage = project.preview || "/projects/fallback.svg";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", project.github ? "SoftwareSourceCode" : "SoftwareApplication"],
    "@id": `${siteUrl}/projects/${project.slug}#project`,
    name: project.slug === "support-kindness" ? "Support Kindness" : project.title,
    alternateName: project.slug === "support-kindness" ? "Care Contribution" : undefined,
    url: project.live || `${siteUrl}/projects/${project.slug}`,
    codeRepository: project.github,
    creator: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      alternateName: profile.aliases,
      url: siteUrl,
    },
    description: project.description,
    programmingLanguage: project.tech,
    applicationCategory: project.category,
    keywords: project.tech.join(", "),
    image: previewImage.startsWith("http") ? previewImage : `${siteUrl}${previewImage}`,
  };
  const galleryImages = useMemo(() => {
    const uniqueImages = [...new Set([...(project.gallery || []), previewImage])];
    return uniqueImages.filter((image) => image !== previewImage).slice(0, 3);
  }, [project.gallery, previewImage]);
  const lightboxImages = [previewImage, ...galleryImages];
  const techStackGroups = useMemo(() => {
    const assigned = new Set();
    const grouped = TECH_STACK_GROUPS.map((group) => {
      const items = project.tech.filter((tech) => {
        const isMatch = group.match.some((keyword) => tech.toLowerCase() === keyword.toLowerCase());
        if (isMatch) assigned.add(tech);
        return isMatch;
      });

      return { title: group.title, items };
    }).filter((group) => group.items.length > 0);

    const remaining = project.tech.filter((tech) => !assigned.has(tech));
    if (remaining.length > 0) {
      grouped.push({ title: "Other Tools", items: remaining });
    }

    return grouped;
  }, [project.tech]);

  return (
    <>
      <SEO
        title={project.title}
        path={`/projects/${project.slug}`}
        description={project.description}
        keywords={[project.title, project.category, ...project.tech]}
        image={previewImage}
        imageAlt={project.previewAlt || `${project.title} project preview`}
        jsonLd={jsonLd}
      />
      <section className="page-section">
        <Link className="mb-8 inline-flex items-center gap-2 text-sm font-black text-teal-700 dark:text-teal-300" to="/projects">
          <FiArrowLeft /> Back to Projects
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow">{project.category}</span>
            <h1 className="page-title">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {project.live || project.github ? (
                <a className="btn-primary" href={project.live || project.github} target="_blank" rel="noreferrer">
                  Live Demo <FiArrowUpRight />
                </a>
              ) : (
                <button className="btn-primary opacity-70" type="button" disabled>
                  Demo Coming Soon
                </button>
              )}
              {project.github && (
                <a className="btn-secondary" href={project.github} target="_blank" rel="noreferrer">
                  GitHub <FiArrowUpRight />
                </a>
              )}
            </div>
          </div>

          <div className={`min-h-[420px] rounded-3xl bg-gradient-to-br ${project.gradient} p-5 text-white shadow-soft sm:p-6`}>
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-white/70" />
              <span className="h-3 w-3 rounded-full bg-white/40" />
              <span className="h-3 w-3 rounded-full bg-white/30" />
            </div>
            <div className="mt-6 rounded-[2rem] border border-white/20 bg-white/12 p-4 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-wide text-white/75">Preview</span>
                <div className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold text-white/90">
                  Main Preview
                </div>
              </div>

              <button
                type="button"
                className="mt-4 block w-full overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/5 text-left"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              >
                <ProjectImage
                  src={previewImage}
                  alt={project.previewAlt || `${project.title} preview`}
                  className="h-[260px] w-full sm:h-[320px]"
                />
              </button>
              <small className="mt-3 block text-white/70">Click the preview to expand.</small>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Highlights</h2>
            <ul className="mt-5 grid gap-3">
              {project.highlights.map((highlight, index) => (
                <li
                  className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5"
                  key={highlight}
                >
                  <div className="flex gap-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-sm font-black text-teal-700 dark:text-teal-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="m-0 text-slate-600 dark:text-slate-300">
                      {highlight}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Tech Stack</h2>
            <div className="mt-5 grid gap-4">
              {techStackGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <span className="text-sm font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">
                      {group.title}
                    </span>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {group.items.map((tech) => (
                        <span className="tag" key={`${group.title}-${tech}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Project Gallery</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Click any image to view larger.</p>
          <div className="mt-4 grid gap-4 grid-cols-2 md:grid-cols-3">
            {galleryImages.map((img, i) => (
              <button
                key={img + i}
                onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }}
                type="button"
                className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-800/60"
              >
                <ProjectImage src={img} alt={project.title + " screenshot " + (i + 2)} className="w-full h-40" />
              </button>
            ))}
          </div>
        </div>
        {/* Lightbox for gallery and preview */}
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </section>
    </>
  );
}

export default ProjectDetails;
