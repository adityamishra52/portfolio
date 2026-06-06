import { motion } from "framer-motion";
import { skills } from "../data/portfolio";

function Skills() {
  return (
    <motion.section
      id="skills"
      className="section-shell"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="section-heading">
        <span className="section-kicker">Skills</span>
        <h2>Modern stack for fast, maintainable product builds.</h2>
        <p>Frontend polish, backend APIs, databases, deployment, and AI integrations in one delivery workflow.</p>
      </div>

      <div className="skills-grid">
        {skills.map((skillGroup) => (
          <article className="skill-card" key={skillGroup.group}>
            <span className="skill-index">0{skills.indexOf(skillGroup) + 1}</span>
            <h3>{skillGroup.group}</h3>
            <p>{skillGroup.summary}</p>
            <div className="tag-list">
              {skillGroup.items.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default Skills;
