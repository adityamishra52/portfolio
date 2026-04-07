import { motion } from "framer-motion";

function Experience() {
    return (
        <motion.section
            id="experience"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <h2>Experience</h2>

            {/* Internship 1 */}
            <div className="exp-card">
                <h3>Web Development Intern</h3>
                <p>SkillDunia</p>
                <span>May 2025 – July 2025</span>

                <ul>
                    <li>Developed a full-stack college website using MERN stack architecture</li>
                    <li>Designed responsive UI and improved overall user experience</li>
                    <li>Integrated REST APIs and managed MongoDB database operations</li>
                </ul>
            </div>

            {/* Internship 2 (NEW 🔥) */}
            <div className="exp-card">
                <h3>Python Developer Intern</h3>
                <p>Brainwiz</p>
                <span>Dec 2025 - Feb 2026</span>

                <ul>
                    <li>Worked with Python libraries such as Pandas and NumPy for data analysis</li>
                    <li>Built applications using Django and Tkinter</li>
                    <li>Developed multiple real-world projects during internship</li>
                    <li>Gained hands-on experience in data processing and GUI development</li>
                </ul>
            </div>

        </motion.section>
    );
}

export default Experience;