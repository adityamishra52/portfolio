import { motion } from "framer-motion";

function About() {
    return (
        <motion.section
            id="about"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2>About Me</h2>
            <p>
                Computer Science graduate with strong skills in MERN stack, Python, and data analysis.
                I have hands-on experience building full-stack web applications and machine learning models through internships and projects.
                I enjoy solving real-world problems using technology and continuously improving my development and analytical skills.
                Currently seeking an opportunity to contribute as a software developer or data analyst.
            </p>
        </motion.section>
    );
}

export default About;