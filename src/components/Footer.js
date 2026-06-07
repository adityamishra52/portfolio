import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";
import { navItems, profile } from "../data/portfolio";
import { projects } from "../data/projects";
import { trackEvent } from "../lib/analytics";

function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/60 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/80 dark:to-slate-800/80" />

      <motion.div
        className="mx-auto w-[min(1220px,calc(100%-24px))] py-12 md:py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Main content grid */}
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand section */}
          <motion.div variants={itemVariants}>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-rose-500 font-black text-white shadow-lg">
                A
              </div>
              <div>
                <strong className="block text-lg font-bold text-slate-950 dark:text-white">{profile.name}</strong>
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">{profile.role}</span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-700 dark:text-slate-300">{profile.intro}</p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link 
                  className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white" 
                  key={item.to} 
                  to={item.to}
                  onClick={() => trackEvent("Navigation", "Menu Click", `Footer:${item.label}`)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Featured Projects */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white">Featured Projects</h3>
            <div className="grid gap-2">
              {projects.slice(0, 4).map((project) => (
                <Link 
                  className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white" 
                  key={project.slug} 
                  to={`/projects/${project.slug}`}
                  onClick={() => trackEvent("Projects", "Project Card Click", `Footer:${project.slug}`)}
                >
                  {project.title}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

        {/* Bottom section */}
        <motion.div
          className="grid gap-6 md:grid-cols-[1fr_auto]"
          variants={itemVariants}
        >
          {/* Contact Info */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              href={`mailto:${profile.email}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("Social", "Email Click", "Footer")}
            >
              <FiMail className="text-lg" />
              <span className="hidden sm:inline">{profile.email}</span>
              <span className="sm:hidden">Email</span>
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("Social", "Phone Click", "Footer")}
            >
              <FiPhone className="text-lg" />
              <span className="hidden sm:inline">{profile.phone}</span>
              <span className="sm:hidden">Phone</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              className="inline-grid h-11 w-11 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-400/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-400/50"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("Social", "GitHub Click", "Footer")}
              aria-label="GitHub"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              className="inline-grid h-11 w-11 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-400/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-400/50"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("Social", "LinkedIn Click", "Footer")}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-10 border-t border-slate-200/60 pt-6 text-center text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400"
          variants={itemVariants}
        >
          <p>
            Copyright {new Date().getFullYear()} {profile.name}. Crafted with care. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;
