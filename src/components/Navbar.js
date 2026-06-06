import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { navItems, profile } from "../data/portfolio";

function Navbar({ theme, onThemeToggle }) {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950"
        : "text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-4 z-50 mx-auto w-[min(1220px,calc(100%-24px))]">
      <nav className="glass-panel flex items-center justify-between gap-3 px-3 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-rose-500 font-black text-white shadow-glow">
            A
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black text-slate-950 dark:text-white sm:text-base">
              {profile.name}
            </span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">MERN Developer</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/hire-me"
            className="hidden rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 sm:inline-flex"
          >
            Hire Me
          </Link>
          <button className="icon-btn" type="button" onClick={onThemeToggle} aria-label="Toggle dark mode">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <button
            className="icon-btn lg:hidden"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-panel mt-2 grid gap-2 p-3 lg:hidden">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/hire-me"
            className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-center text-sm font-black text-white"
            onClick={() => setOpen(false)}
          >
            Hire Me
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
