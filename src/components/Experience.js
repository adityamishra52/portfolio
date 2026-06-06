import { motion } from "framer-motion";
import { experiences } from "../data/portfolio";

function Experience() {
  return (
    <motion.section
      id="experience"
      className="section-shell"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="section-heading">
        <span className="section-kicker">Experience</span>
        <h2>Real-world work across full-stack delivery.</h2>
      </div>

      <div className="timeline">
        {experiences.map((item) => (
          <article className="timeline-item" key={`${item.title}-${item.org}`}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.org}</p>
            </div>
            <span className="timeline-date">{item.date}</span>
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default Experience;
