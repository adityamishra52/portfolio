import { motion } from "framer-motion";

function Education() {
  const education = [
    {
      degree: "B.Tech - Computer Science & Engineering",
      school: "Jharkhand University of Technology",
      detail: "2025 | CGPA: 7.9",
    },
    {
      degree: "Diploma - Computer Science & Engineering",
      school: "Jharkhand University of Technology",
      detail: "2022 | 85.6%",
    },
  ];

  return (
    <motion.section
      id="education"
      className="section-shell"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="section-heading compact-heading">
        <span className="section-kicker">Education</span>
        <h2>Computer science foundation with hands-on project depth.</h2>
      </div>

      <div className="education-grid">
        {education.map((item) => (
          <article className="info-card" key={item.degree}>
            <h3>{item.degree}</h3>
            <p>{item.school}</p>
            <span>{item.detail}</span>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default Education;
