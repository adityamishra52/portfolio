import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Gallery from "./pages/Gallery";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import HireMe from "./pages/HireMe";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-page" />
      <ScrollToTop />
      {!isAdmin && <Navbar theme={theme} onThemeToggle={onThemeToggle} />}
      <main>
        <Routes>
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

  return (
    <BrowserRouter>
      <AppShell theme={theme} onThemeToggle={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
    </BrowserRouter>
  );
}

export default App;
