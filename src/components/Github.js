import { motion } from "framer-motion";

function Github() {
  return (
    <motion.section
      id="github"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>GitHub Profile</h2>

      <div className="github-card">
        <h3>Aditya Kumar Mishra</h3>
        <p>Explore my projects, contributions, and code repositories.</p>

        <a 
          href="https://github.com/adityamishra52" 
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          Visit GitHub
        </a>
      </div>
    </motion.section>
  );
}

export default Github;