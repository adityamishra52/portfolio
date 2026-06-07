import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiDownload, FiMail } from "react-icons/fi";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import { profile, skills } from "../data/portfolio";
import { projects } from "../data/projects";
import useImagePreload from "../utils/useImagePreload";
import { trackEvent } from "../lib/analytics";

function Home() {
  useImagePreload(projects.slice(0, 3).map((project) => project.preview).filter(Boolean));

  return (
    <>
      <SEO
        title="Premium Full Stack MERN Developer Portfolio"
        path="/"
        description="Premium animated portfolio of Aditaya Kumar Mishra, Full Stack MERN Developer building React, Vite, Node.js, MongoDB, AI web apps, SEO-ready websites, and modern web products."
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

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              {["5+ real projects", "AI + MERN stack", "SEO-ready delivery"].map((item) => (
                <div
                  className="rounded-3xl border border-slate-200/70 bg-white/82 p-4 text-slate-900 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white"
                  key={item}
                >
                  <strong className="block text-lg text-slate-950 dark:text-white">{item.split(" ")[0]}</strong>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.split(" ").slice(1).join(" ")}</span>
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
            <div className="rounded-[2rem] border border-teal-200/70 bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600 p-8 text-white shadow-soft lg:p-10">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Featured Launch</span>
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
