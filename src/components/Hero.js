import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiDownload, FiMail } from "react-icons/fi";
import { profile } from "../data/portfolio";

function Hero() {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.section
      id="top"
      className="hero section-shell"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="hero-content">
        <div className="hero-copy">
          <span className="eyebrow">Available for MERN, AI web app, and SEO-focused product work</span>
          <h1>{profile.name}</h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-desc">{profile.intro}</p>

          <div className="hero-actions">
            <button className="btn primary" type="button" onClick={() => scrollToSection("projects")}>
              View Projects <FiArrowUpRight />
            </button>
            <a className="btn secondary" href={profile.resume} target="_blank" rel="noreferrer">
              Resume <FiDownload />
            </a>
            <a className="btn ghost" href={`mailto:${profile.email}`}>
              Contact <FiMail />
            </a>
          </div>

          <div className="hero-stats" aria-label="Portfolio highlights">
            <span>
              <strong>2+</strong>
              Live MERN products
            </span>
            <span>
              <strong>AI</strong>
              Creator tools
            </span>
            <span>
              <strong>SEO</strong>
              Recruiter-ready site
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Profile card">
          <div className="availability-pill">Open to work</div>
          <img src="/Aditaya.png" alt="Aditaya Kumar Mishra" className="profile-img" />
          <div className="hero-card">
            <span>Core stack</span>
            <strong>React, Node.js, MongoDB, AI APIs</strong>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Hero;
