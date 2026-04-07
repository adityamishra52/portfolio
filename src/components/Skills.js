import { motion } from "framer-motion";
function Skills() {
  
  return (
    <motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
      <h2>Skills</h2>
      <div className="skills">

  <div>
    <h4>Frontend</h4>
    
    <span>HTML & CSS</span>
    <span>React.js</span>
    <span>Tkinter</span>
  </div>

  <div>
    <h4>Backend</h4>
    <span>Node.js</span>
    <span>Express.js</span>
    <span>Django</span>
  </div>

  <div>
    <h4>Database</h4>
    <span>MongoDB</span>
    <span>MySQL</span>
  </div>

  <div>
    <h4>Data & ML</h4>
    <span>Pandas</span>
    <span>NumPy</span>
    <span>Power BI</span>
    <span>Machine Learning</span>
  </div>

</div>
    </motion.section>
  );
}

export default Skills;