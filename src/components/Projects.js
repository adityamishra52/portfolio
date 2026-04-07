import { motion } from "framer-motion";

const projects = [
  {
    title: "CharityVibe Platform",
    desc: "A full-stack MERN application connecting donors with people in need. Implemented RESTful APIs, authentication, and a responsive UI for seamless donation experience.",
    link: "https://github.com/adityamishra52/Charity"
  },
  {
    title: "Stock Price Prediction",
    desc: "Machine learning model to predict stock prices using Linear Regression and Random Forest. Performed data preprocessing, analysis, and visualization using Pandas and Matplotlib.",
    link: "https://github.com/adityamishra52/Stock-Market-Prediction-ML"
  },
  {
    title: "Real Estate Price Predictor",
    desc: "Built a house price prediction system using machine learning techniques. Applied data cleaning, feature engineering, and regression models.",
    link: "https://github.com/adityamishra52/RealEstate_Price_Predictor"
  },
  {
    title: "Student Registration System",
    desc: "Desktop-based student management system using Python, MySQL, and Tkinter. Implemented CRUD operations and database integration.",
    link: "https://github.com/adityamishra52/StudentRegistration_Python_Mysql_Tkinter"
  },
  {
    title: "Employee Management System",
    desc: "Developed an employee management system with features to add, update, and delete records efficiently.",
    link: "https://github.com/adityamishra52/Employee_Management_System"
  }
];

function Projects() {
  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>Featured Projects</h2>

      <div className="projects">
        {projects.map((project, index) => (
          <div className="card" key={index}>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>

            <a href={project.link} target="_blank" rel="noreferrer">
              🔗 View on GitHub
            </a>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export default Projects;