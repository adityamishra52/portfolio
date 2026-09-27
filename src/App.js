import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import { EASE_OUT } from "./components/Reveal";
import { initAnalytics, trackPageView } from "./lib/analytics";
import { initClarity } from "./lib/clarity";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Skills = lazy(() => import("./pages/Skills"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Experience = lazy(() => import("./pages/Experience"));
const Education = lazy(() => import("./pages/Education"));
const Contact = lazy(() => import("./pages/Contact"));
const HireMe = lazy(() => import("./pages/HireMe"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function AppShell({ theme, onThemeToggle }) {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin-aditaya";

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    // Route-level page tracking starts here for React Router navigation.
    trackPageView(path);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-page" />
      {!isAdmin && <CursorGlow />}
      {!isAdmin && <ScrollProgress />}
      <ScrollToTop />
      {!isAdmin && <Navbar theme={theme} onThemeToggle={onThemeToggle} />}
      <main>
        <Suspense fallback={<div className="page-section text-slate-950 dark:text-white">Loading page...</div>}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/hire-me" element={<HireMe />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admin-aditaya" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const nextTheme = event?.detail;
      if (nextTheme === "dark" || nextTheme === "light") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener("portfolio-theme-change", handleThemeChange);
    return () => window.removeEventListener("portfolio-theme-change", handleThemeChange);
  }, []);

  useEffect(() => {
    // App startup initialization for Google Analytics and Microsoft Clarity.
    initAnalytics();
    initClarity();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppShell theme={theme} onThemeToggle={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
