import React from "react";
import { motion } from "framer-motion";

function Hero() {
  return (
    <motion.section 
      className="hero"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="hero-content">

        {/* LEFT TEXT */}
        <div>
          <h1>Aditaya Kumar Mishra</h1>
          <p>Full Stack Developer | Data Analyst | ML Enthusiast</p>
<h3>Building scalable applications and solving real-world problems with data</h3>

<p className="hero-desc">
  MERN Stack Developer with hands-on experience in full-stack projects and machine learning models.
</p>
          <a href="/Aditaya_Mishra_Resume.pdf" target="_blank" rel="noreferrer" className="btn">
            View Resume
          </a>
          
        </div>

        {/* RIGHT IMAGE */}
        <div>
          <img src="/Aditaya.png" alt="profile" className="profile-img" />
        </div>

      </div>
    </motion.section>
  );
}

export default Hero;