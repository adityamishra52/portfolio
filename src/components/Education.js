import { motion } from "framer-motion";

function Education() {
  return (
    <motion.section
      id="education"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>Education</h2>

      <div className="edu-card">
        <h3>B.Tech - Computer Science & Engineering</h3>
        <p>Jharkhand University of Technology</p>
        <span>2025 | CGPA: 7.9</span>
      </div>

      <div className="edu-card">
        <h3>Diploma - Computer Science & Engineering</h3>
        <p>Jharkhand University of Technology</p>
        <span>2022 | 85.6%</span>
      </div>
    </motion.section>
  );
}

export default Education;