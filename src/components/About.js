import { motion } from "framer-motion";

function About() {
  return (
    <motion.section
      id="about"
      className="section-shell split-section"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div>
        <span className="section-kicker">About</span>
        <h2>Developer focused on practical, polished web products.</h2>
      </div>
      <div className="rich-copy">
        <p>
          I am a Computer Science graduate and Full Stack Developer building modern web applications with React,
          Node.js, Express, MongoDB, and clean API integrations. My work blends product thinking with reliable
          engineering: fast interfaces, useful dashboards, responsive layouts, and workflows that feel clear to real
          users.
        </p>
        <p>
          Recently I have focused on AI-assisted creator tools, community support platforms, SEO-ready portfolios, and
          production deployment on Vercel and Render. I care about making projects easy for recruiters, clients, and
          collaborators to understand quickly.
        </p>
      </div>
    </motion.section>
  );
}

export default About;
