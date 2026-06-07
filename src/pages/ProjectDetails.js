import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import SEO from "../components/SEO";
import { getProjectBySlug, projects } from "../data/projects";
import { siteUrl, profile } from "../data/portfolio";
import Lightbox from "../components/Lightbox";
import ProjectImage from "../components/ProjectImage";
import useImagePreload from "../utils/useImagePreload";
import { trackEvent } from "../lib/analytics";

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
  const projectUrl = project.live || `${siteUrl}/projects/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", project.github ? "SoftwareSourceCode" : "SoftwareApplication"],
    "@id": `${siteUrl}/projects/${project.slug}#project`,
    name: project.slug === "support-kindness" ? "Support Kindness" : project.title,
    alternateName: project.slug === "support-kindness" ? "Care Contribution" : undefined,
    url: projectUrl,
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
    operatingSystem: project.live ? "Web" : undefined,
    keywords: project.tech.join(", "),
    image: previewImage.startsWith("http") ? previewImage : `${siteUrl}${previewImage}`,
    sameAs: project.live ? [project.live] : undefined,
  };
  const galleryItems = useMemo(() => {
    const gallery = Array.isArray(project.gallery) ? [...new Set(project.gallery)] : [];
    if (gallery.length > 0) {
      return gallery.slice(0, 3).map((image, index) => ({
        src: image,
        alt: `${project.title} screenshot ${index + 1}`,
        placeholder: false,
        label: null,
      }));
    }

    return (project.galleryPlaceholders || []).slice(0, 3).map((label, index) => ({
      src: "/projects/fallback.svg",
      alt: `${project.title} placeholder screenshot ${index + 1}`,
      placeholder: true,
      label,
    }));
  }, [project.gallery, project.galleryPlaceholders, project.title]);
  const lightboxImages = [previewImage, ...galleryItems.map((item) => item.src)];
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
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300">
                {project.badgeLabel || (project.live ? "Live Project" : "Case Study")}
              </span>
              {project.status && (
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Status: {project.status}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {project.live || project.github ? (
                <>
                  <a
                    className="btn-primary"
                    href={project.live || project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("Projects", "Live Demo Click", `${project.slug}:hero`)}
                  >
                    Live Demo <FiArrowUpRight />
                  </a>
                  {project.live && (
                    <a
                      className="btn-secondary"
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent("Projects", "Visit Website Click", `${project.slug}:hero`)}
                    >
                      Visit Website <FiArrowUpRight />
                    </a>
                  )}
                </>
              ) : null}
              {project.github && (
                <a
                  className="btn-secondary"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("Projects", "GitHub Repository Click", project.slug)}
                >
                  GitHub <FiArrowUpRight />
                </a>
              )}
              {project.slug === "optiresume" && project.live && (
                <a
                  className="btn-primary"
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("Projects", "Try OptiResume Click", project.slug)}
                >
                  Try OptiResume <FiArrowUpRight />
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

        {project.overview && (
          <div className="mt-10 glass-panel p-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Project Overview</h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600 dark:text-slate-300">{project.overview}</p>
          </div>
        )}

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

        {(project.architecture?.length > 0 || project.problemSolved?.length > 0 || project.roadmap?.length > 0) && (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { title: "Technical Architecture", items: project.architecture || [] },
              { title: "Problem Solved", items: project.problemSolved || [] },
              { title: "Future Roadmap", items: project.roadmap || [] },
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
        )}

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
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {galleryItems.some((item) => item.placeholder)
              ? "Placeholder cards are shown until final OptiResume screenshots are added."
              : "Click any image to view larger."}
          </p>
          <div className="mt-4 grid gap-4 grid-cols-2 md:grid-cols-3">
            {galleryItems.map((item, i) => (
              <button
                key={`${item.src}-${item.label || i}`}
                onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }}
                type="button"
                className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-800/60"
              >
                <div className="relative">
                  <ProjectImage src={item.src} alt={item.alt} className="h-40 w-full" />
                  {item.placeholder && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent p-4 text-left">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {project.cta?.url && (
          <div className="mt-10 rounded-3xl border border-teal-200/70 bg-gradient-to-br from-teal-500 to-cyan-600 p-8 text-white shadow-soft">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Call To Action</span>
            <h3 className="mt-3 text-3xl font-black">{project.cta.heading}</h3>
            <div className="mt-6">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
                href={project.cta.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("Projects", "Project CTA Click", project.slug)}
              >
                {project.cta.label} <FiArrowUpRight />
              </a>
            </div>
          </div>
        )}

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
                  onClick={() => trackEvent("Projects", "Project Card Click", `${item.slug}:related`)}
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
