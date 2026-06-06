import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { profile } from "../data/portfolio";

function Github() {
  return (
    <motion.section
      id="github"
      className="section-shell github-section"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="github-panel">
        <div>
          <span className="section-kicker">Code profile</span>
          <h2>Explore repositories, experiments, and full-stack builds.</h2>
          <p>GitHub includes MERN applications, data projects, Python work, and ongoing portfolio improvements.</p>
        </div>
        <a className="btn primary" href={profile.github} target="_blank" rel="noreferrer">
          GitHub <FiGithub />
        </a>
      </div>
    </motion.section>
  );
}

export default Github;
