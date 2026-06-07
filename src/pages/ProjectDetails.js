import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import SEO from "../components/SEO";
import { getProjectBySlug, projects } from "../data/projects";
import { siteUrl, profile } from "../data/portfolio";
import Lightbox from "../components/Lightbox";
import ProjectImage from "../components/ProjectImage";
import useImagePreload from "../utils/useImagePreload";
import { trackEvent } from "../utils/analytics";

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
  useImagePreload([previewImage, ...(project.gallery || []).slice(0, 3)]);
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
  const relatedProjects = useMemo(
    () => projects.filter((item) => project.related?.includes(item.slug)).slice(0, 3),
    [project.related]
  );

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
            {project.summary && (
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">{project.summary}</p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {project.live || project.github ? (
                <a
                  className="btn-primary"
                  href={project.live || project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("project_click", { project_slug: project.slug, target: "hero-live-demo" })}
                >
                  Live Demo <FiArrowUpRight />
                </a>
              ) : (
                <button className="btn-primary opacity-70" type="button" disabled>
                  Demo Coming Soon
                </button>
              )}
              {project.github && (
                <a
                  className="btn-secondary"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("project_click", { project_slug: project.slug, target: "github" })}
                >
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
                className="mt-4 block w-full overflow-hidden rounded-[1.5rem] border border-white/20 bg-slate-900 text-left"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-slate-900">
                  <ProjectImage
                    src={previewImage}
                    alt={project.previewAlt || `${project.title} preview`}
                    className="h-full w-full"
                    imageClassName="relative z-10 h-full w-full object-cover transition duration-700"
                    priority
                    sizes="(min-width: 1024px) 42vw, 100vw"
                  />
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>
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

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { title: "Key Features", items: project.features || [] },
            { title: "Challenges", items: project.challenges || [] },
            { title: "Solutions", items: project.solutions || [] },
          ].map((section) => (
            <div className="glass-panel p-6" key={section.title}>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{section.title}</h3>
              <ul className="mt-4 grid gap-3">
                {section.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {project.results?.length > 0 && (
          <div className="mt-10 glass-panel p-6">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">Project Outcome</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {project.results.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

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

        {relatedProjects.length > 0 && (
          <div className="mt-10">
            <div className="section-heading">
              <span className="eyebrow">Related Projects</span>
              <h3>More case studies from the same stack and product direction</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((item) => (
                <Link
                  key={item.slug}
                  to={`/projects/${item.slug}`}
                  onClick={() => trackEvent("project_click", { project_slug: item.slug, target: "related-project" })}
                  className="glass-panel block p-4 transition hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                    <ProjectImage
                      src={item.preview || "/projects/fallback.svg"}
                      alt={item.previewAlt || item.title}
                      className="h-full w-full"
                      imageClassName="relative z-10 h-full w-full object-cover transition duration-700"
                    />
                    <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  </div>
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">{item.category}</p>
                  <h4 className="mt-2 text-lg font-black text-slate-950 dark:text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary || item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
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
