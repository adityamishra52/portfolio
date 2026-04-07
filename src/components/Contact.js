import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa"; 
function Contact() {
  return (
    <motion.footer
      id="contact"
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>Let’s Connect</h2>

      <p className="footer-desc">
        I’m open to opportunities in Software Development and Data Analysis.  
        Feel free to reach out!
      </p>

      <div className="contact-info">
        <p>📧 adityamishra5214352@gmail.com</p>
        <p>📞 +91 6360847309</p>
      </div>

      <div className="social-links">
        <a href="https://github.com/adityamishra52" target="_blank"><FaGithub />  GitHub</a>
        <a href="https://www.linkedin.com/in/aditaya-kumar-mishra" target="_blank"><FaLinkedin /> LinkedIn</a>
      </div>

      <p className="copyright">
        © 2026 Aditaya Kumar Mishra. All rights reserved.
      </p>
    </motion.footer>
  );
}

export default Contact;