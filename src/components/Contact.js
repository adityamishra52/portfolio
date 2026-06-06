import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { profile } from "../data/portfolio";

function Contact() {
  return (
    <motion.section
      id="contact"
      className="contact-section section-shell"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="contact-panel">
        <div>
          <span className="section-kicker">Contact</span>
          <h2>Need a React, MERN, or AI web app developer?</h2>
          <p>
            I am open to software development roles, freelance builds, internships, and collaborations where clean
            product delivery matters.
          </p>
        </div>

        <div className="contact-actions">
          <a className="btn primary" href={`mailto:${profile.email}`}>
            Email Me <FiMail />
          </a>
          <a className="btn secondary" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <FaLinkedin />
          </a>
        </div>
      </div>

      <div className="footer-meta">
        <a href={`mailto:${profile.email}`}>
          <FiMail /> {profile.email}
        </a>
        <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
          <FiPhone /> {profile.phone}
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <FaGithub /> GitHub
        </a>
      </div>
    </motion.section>
  );
}

export default Contact;
