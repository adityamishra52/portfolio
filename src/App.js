
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import "./App.css";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Github from "./components/Github";



function App() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrollPosition = window.scrollY;
      setScroll((scrollPosition / totalHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🔥 ADD HERE (TOP) */}
      <div
        className="progress-bar"
        style={{ width: scroll + "%" }}
      ></div>

      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Github />
      <Contact />
    </>
  );
}

export default App;