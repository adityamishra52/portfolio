import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { navItems, profile } from "../data/portfolio";
import { trackEvent } from "../lib/analytics";

const inactiveLinkClass =
  "text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white";

function Navbar({ theme, onThemeToggle }) {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? "bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950" : inactiveLinkClass
    }`;

  // Desktop links draw the active background as a shared-layout pill so it
  // slides between items instead of snapping.
  const desktopLinkClass = ({ isActive }) =>
    `relative isolate inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive ? "text-white dark:text-slate-950" : inactiveLinkClass
    }`;

  return (
    <header className="sticky top-3 z-50 mx-auto w-[min(1220px,calc(100%-20px))] sm:top-4 sm:w-[min(1220px,calc(100%-24px))]">
      <nav className="glass-panel flex items-center justify-between gap-3 px-3 py-3">
        <Link to="/" className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden" onClick={() => { setOpen(false); trackEvent("Navigation", "Menu Click", "Brand Home"); }}>
          <img
            src="/logo.png"
            alt="Aditaya Kumar Mishra logo"
            className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-glow"
            width="48"
            height="48"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-black text-slate-950 dark:text-white sm:text-base">
              {profile.name}
            </span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">MERN Developer</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={desktopLinkClass} onClick={() => trackEvent("Navigation", "Menu Click", item.label)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-slate-950 shadow-soft dark:bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/hire-me"
            className="hidden rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 sm:inline-flex"
            onClick={() => trackEvent("Navigation", "Menu Click", "Hire Me CTA")}
          >
            Hire Me
          </Link>
          <button className="icon-btn" type="button" onClick={onThemeToggle} aria-label="Toggle dark mode">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <button
            className="icon-btn lg:hidden"
            type="button"
            onClick={() => {
              setOpen((value) => !value);
              trackEvent("Navigation", "Mobile Menu Click", open ? "Close Mobile Menu" : "Open Mobile Menu");
            }}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="glass-panel mt-2 grid max-h-[calc(100dvh-110px)] gap-2 overflow-y-auto p-3 lg:hidden"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                className="grid"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * index }}
              >
                <NavLink to={item.to} className={linkClass} onClick={() => { setOpen(false); trackEvent("Navigation", "Mobile Menu Click", item.label); }}>
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <Link
              to="/hire-me"
              className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-center text-sm font-black text-white"
              onClick={() => { setOpen(false); trackEvent("Navigation", "Mobile Menu Click", "Hire Me CTA"); }}
            >
              Hire Me
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
