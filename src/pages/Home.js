import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiDownload, FiExternalLink, FiMail, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import { deliveryHighlights, portfolioProof, profile, skills, techMarquee } from "../data/portfolio";
import { projects } from "../data/projects";
import useImagePreload from "../utils/useImagePreload";
import { trackEvent } from "../lib/analytics";

function Home() {
  useImagePreload(projects.slice(0, 3).map((project) => project.preview).filter(Boolean));

  return (
    <>
      <SEO
        title="Aditaya Kumar Mishra Portfolio"
        path="/"
        description="Aditaya Kumar Mishra portfolio, also searchable as Aditaya, Aditya, Aditaya Mishra, and adityamishra52. Full Stack MERN Developer building React, Vite, Node.js, MongoDB, AI web apps, SEO-ready websites, and modern web products."
        keywords={[
          "Aditaya",
          "Aditya",
          "Aditaya portfolio",
          "Aditaya Kumar Mishra portfolio",
          "Aditaya full stack developer",
          "adityamishra52 portfolio",
        ]}
      />

      <div className="text-slate-950 dark:text-white">
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="eyebrow">Available for full-stack, AI app, and SEO-ready web projects</span>
                <h1 className="fluid-title mt-6 text-balance font-black text-slate-950 dark:text-white">
                  {profile.name}
                </h1>
                <p className="mt-5 text-2xl font-black text-teal-500 dark:text-teal-400">{profile.role}</p>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{profile.intro}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Open to work", value: "Full-time / Freelance", icon: FiZap },
                    { label: "Focus", value: "AI + MERN products", icon: FiTrendingUp },
                    { label: "Quality", value: "SEO + testing ready", icon: FiShield },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div className="hero-signal" key={item.label}>
                        <Icon />
                        <span>
                          <strong>{item.label}</strong>
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link className="btn-primary" to="/projects" onClick={() => trackEvent("Navigation", "Menu Click", "Home View Projects")}>
                    View Projects <FiArrowRight />
                  </Link>
                  <Link className="btn-secondary" to="/contact" onClick={() => trackEvent("Navigation", "Menu Click", "Home Contact Me")}>
                    Contact Me <FiMail />
                  </Link>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Resume analytics are tracked here for preview and explicit download actions. */}
                    <a
                      className="btn-secondary"
                      href={profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent("Resume", "Resume Preview", "Home Hero")}
                    >
                      Preview Resume <FiDownload />
                    </a>
                    <a
                      className="btn-secondary"
                      href={profile.resume}
                      download
                      onClick={() => trackEvent("Resume", "Resume Download", "Home Hero")}
                    >
                      Download PDF <FiDownload />
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div className="hero-profile glass-panel">
                  <div className="absolute inset-8 rounded-3xl border border-slate-200/70 bg-grid opacity-70 dark:border-white/10" />
                  <img
                    src={profile.image}
                    alt="Aditaya Kumar Mishra"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width="700"
                    height="700"
                    className="relative z-10 max-w-full aspect-square object-cover"
                  />
                  <div className="absolute right-6 top-6 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm font-black text-teal-700 shadow-soft backdrop-blur dark:bg-slate-950/70 dark:text-teal-300">
                    Open to work
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/75 p-4 backdrop-blur dark:bg-slate-950/75">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Core stack
                    </span>
                    <strong className="mt-1 block text-slate-950 dark:text-white">
                      React, Vite, Node.js, MongoDB, Tailwind, SEO, AI APIs
                    </strong>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {["6+ real projects", "AI + MERN stack", "SEO-ready delivery"].map((item) => (
                <div
                  className="rounded-3xl border border-slate-200/70 bg-white/82 p-4 text-slate-900 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white"
                  key={item}
                >
                  <strong className="block text-lg text-slate-950 dark:text-white">{item.split(" ")[0]}</strong>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>

            <div className="tech-marquee mt-8" aria-label="Core technologies">
              <div className="tech-marquee-track">
                {[...techMarquee, ...techMarquee].map((tech, index) => (
                  <span key={`${tech}-${index}`}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="page-section pt-8 sm:pt-10 lg:pt-12">
            <div className="section-heading">
              <span className="eyebrow">Delivery System</span>
              <h2>Modern portfolio, product thinking, and build quality in one place.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {deliveryHighlights.map((item, index) => (
                <motion.div
                  className="feature-card h-full p-6"
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.06 }}
                >
                  <span className="feature-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-2xl font-black leading-tight text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="page-section">
            <div className="section-heading">
              <span className="eyebrow">Portfolio Proof</span>
              <h2>What makes this portfolio stronger for recruiters and clients.</h2>
              <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
                Beyond showing project names, this portfolio highlights delivery ability, case-study clarity, and the
                testing mindset needed for professional web work.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {portfolioProof.map((item) => (
                <div className="glass-card flex h-full flex-col p-6" key={item.title}>
                  <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-teal-500/10 text-xl text-teal-700 dark:text-teal-300">
                    <FiCheckCircle />
                  </div>
                  <h3 className="mt-5 text-2xl font-black leading-tight text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.points.map((point) => (
                      <span className="tag" key={point}>
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="page-section">
            <div className="section-heading">
              <span className="eyebrow">Featured Projects</span>
              <h2>Production-style builds with clean UX and real use cases.</h2>
            </div>
            <div className="grid items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {projects.slice(0, 3).map((project, index) => (
                <ProjectCard project={project} featured={index === 0} key={project.slug} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="page-section">
            <div className="grid overflow-hidden rounded-[2rem] border border-blue-200/70 bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 text-white shadow-soft lg:grid-cols-[1fr_.85fr]">
              <div className="p-8 lg:p-10">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Newest Launch</span>
                <h2 className="mt-4 text-3xl font-black sm:text-4xl">Portfolio Builder is now part of the project showcase</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/90">
                  A SaaS-style AI portfolio maker with a landing page, guided builder, template selection, dashboard,
                  and live publishing workflow.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
                    to="/projects/portfolio-builder"
                    onClick={() => trackEvent("Projects", "View Portfolio Builder Click", "home-cta")}
                  >
                    View Case Study <FiArrowRight />
                  </Link>
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                    href="https://portfolios-rho-six.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("Projects", "Launch Portfolio Builder Click", "home-cta")}
                  >
                    Open Live Site <FiExternalLink />
                  </a>
                </div>
              </div>
              <div className="relative min-h-64 bg-slate-950/20 p-5 lg:p-6">
                <img
                  src="/projects/portfolio-builder-dashboard.png"
                  alt="Portfolio Builder dashboard preview"
                  loading="lazy"
                  decoding="async"
                  className="h-full min-h-60 w-full rounded-[1.5rem] border border-white/20 object-cover shadow-2xl"
                />
              </div>
            </div>
            <div className="mt-6 rounded-[2rem] border border-teal-200/70 bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600 p-8 text-white shadow-soft lg:p-10">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">AI Resume Product</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">Build your professional resume with OptiResume</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/90">
                Create, edit, preview, and export recruiter-ready resumes with OptiResume&apos;s live AI-powered builder.
              </p>
              <div className="mt-6">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
                  href="https://optiresume-one.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("Projects", "Launch OptiResume Click", "home-cta")}
                >
                  Launch OptiResume <FiArrowRight />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="page-section">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <div className="section-heading">
                <span className="eyebrow">Skills Snapshot</span>
                <h2>Balanced across UI, APIs, databases, SEO, and deployment.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {skills.map((skill) => (
                  <div className="glass-card p-5" key={skill.group}>
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">{skill.group}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{skill.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
