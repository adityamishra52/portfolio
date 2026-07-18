import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowUp, FiMail, FiPhone } from "react-icons/fi";
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackEvent("Navigation", "Back To Top Click", "Footer");
  };

  return (
    <footer className="relative mt-16 pb-6 sm:mt-24 sm:pb-8">
      <div className="mx-auto w-[min(1220px,calc(100%-20px))] sm:w-[min(1220px,calc(100%-24px))]">
        <motion.div
          className="glass-panel relative overflow-hidden p-6 sm:p-10 lg:p-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-teal-400 via-cyan-400 to-rose-400" />
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-400/10" />

          {/* Main content grid */}
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand section */}
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt="Aditaya Kumar Mishra logo"
                  className="h-14 w-14 rounded-2xl object-cover shadow-glow"
                  width="56"
                  height="56"
                />
                <div>
                  <strong className="block text-lg font-black text-slate-950 dark:text-white">{profile.name}</strong>
                  <span className="text-xs font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">{profile.role}</span>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">{profile.intro}</p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="footer-title">Quick Navigation</h3>
              <div className="grid grid-cols-2 gap-1">
                {navItems.map((item) => (
                  <Link
                    className="footer-link"
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
              <h3 className="footer-title">Featured Projects</h3>
              <div className="grid gap-1">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    className="footer-link truncate"
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
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/10" />

          {/* Bottom section */}
          <motion.div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between" variants={itemVariants}>
            {/* Contact Info */}
            <div className="flex flex-wrap gap-3">
              <a
                className="contact-pill transition duration-300 hover:-translate-y-1 hover:border-teal-400/50"
                href={`mailto:${profile.email}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("Social", "Email Click", "Footer")}
              >
                <FiMail className="text-lg text-teal-600 dark:text-teal-300" />
                <span className="hidden sm:inline">{profile.email}</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a
                className="contact-pill transition duration-300 hover:-translate-y-1 hover:border-teal-400/50"
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("Social", "Phone Click", "Footer")}
              >
                <FiPhone className="text-lg text-teal-600 dark:text-teal-300" />
                <span className="hidden sm:inline">{profile.phone}</span>
                <span className="sm:hidden">Phone</span>
              </a>
            </div>

            {/* Social Links + Back to top */}
            <div className="flex items-center gap-2.5">
              <a
                className="inline-grid h-11 w-11 place-items-center rounded-full border border-slate-200/80 bg-white/75 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-br hover:from-teal-500 hover:to-cyan-500 hover:text-white hover:shadow-glow dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
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
                className="inline-grid h-11 w-11 place-items-center rounded-full border border-slate-200/80 bg-white/75 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-br hover:from-teal-500 hover:to-cyan-500 hover:text-white hover:shadow-glow dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("Social", "LinkedIn Click", "Footer")}
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <button
                className="inline-grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-glow transition duration-300 hover:-translate-y-1"
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                title="Back to top"
              >
                <FiArrowUp />
              </button>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="mt-10 border-t border-slate-200/60 pt-6 text-center text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400"
            variants={itemVariants}
          >
            <p>
              &copy; {new Date().getFullYear()} {profile.name}. Designed, built, and deployed end-to-end by one full-stack developer.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
