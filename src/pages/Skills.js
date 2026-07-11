import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { skills } from "../data/portfolio";
import { FaReact, FaNode, FaDatabase, FaGithub, FaPython } from "react-icons/fa";
import { SiTypescript, SiMongodb, SiTailwindcss, SiExpress } from "react-icons/si";

function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "skill-level-expert";
      case "Experienced":
        return "skill-level-experienced";
      case "Practical":
        return "skill-level-practical";
      case "Strong":
        return "skill-level-strong";
      default:
        return "skill-level-expert";
    }
  };

  const topTechnologies = [
    { icon: FaReact, name: "React.js", color: "text-cyan-500" },
    { icon: SiExpress, name: "Express.js", color: "text-gray-600 dark:text-gray-300" },
    { icon: FaNode, name: "Node.js", color: "text-green-600" },
    { icon: SiMongodb, name: "MongoDB", color: "text-green-500" },
    { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-400" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600" },
    { icon: FaPython, name: "Python", color: "text-blue-500" },
    { icon: FaGithub, name: "GitHub", color: "text-slate-700 dark:text-slate-300" },
  ];

  return (
    <>
      <SEO
        title="Aditaya Skills"
        path="/skills"
        description="Skills of Aditaya Kumar Mishra across React, Vite, Tailwind CSS, Node.js, Express, MongoDB, SEO, deployment, AI web app development, testing, and MERN projects."
        keywords={["Aditaya skills", "Aditaya developer skills", "Aditaya React skills", "Aditaya MERN skills", "Aditaya SEO skills"]}
      />

      <section className="page-section">
        {/* Header */}
        <div className="section-heading">
          <span className="eyebrow">Expertise</span>
          <h1 className="page-title">Aditaya Kumar Mishra skills: modern full-stack toolkit for premium product delivery</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            I craft production-ready applications with clean architecture, responsive design, and strong engineering practices. Every skill is backed by real project experience.
          </p>
        </div>

        {/* Top Technologies Showcase */}
        <motion.div
          className="mb-16 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white/40 to-white/20 p-8 backdrop-blur-sm dark:border-white/10 dark:from-slate-950/40 dark:to-slate-950/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-2xl font-bold text-slate-950 dark:text-white">Currently Working With</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {topTechnologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200/50 bg-white/50 p-4 text-center transition hover:border-teal-400/50 hover:bg-teal-50/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-teal-950/20"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Icon className={`text-3xl ${tech.color}`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{tech.name}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skills.map((skill, index) => (
            <motion.article
              key={skill.group}
              className="skill-card"
              variants={cardVariants}
            >
              {/* Card Header with Title and Badge */}
              <div className="skill-card-header">
                <h3 className="skill-group-title">{skill.group}</h3>
              </div>

              {/* Level Badge */}
              <div className="flex gap-2">
                <span className={`skill-level-badge ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>

              {/* Description */}
              <p className="skill-description">{skill.summary}</p>

              {/* Skill Tags */}
              <div className="skill-tags">
                {skill.items.map((item) => (
                  <span key={item} className="skill-tag">
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Highlight Section */}
        <motion.div
          className="mt-16 grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 p-6 dark:border-teal-400/20 dark:from-teal-950/30 dark:to-cyan-950/30">
            <h3 className="mb-3 font-bold text-teal-900 dark:text-teal-200">Web Development</h3>
            <p className="text-sm text-teal-800 dark:text-teal-300">React, Vue, Vite, Tailwind CSS, responsive design, accessibility, and modern frontend practices.</p>
          </div>
          <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 dark:border-blue-400/20 dark:from-blue-950/30 dark:to-indigo-950/30">
            <h3 className="mb-3 font-bold text-blue-900 dark:text-blue-200">Backend & APIs</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">Node.js, Express, REST APIs, authentication, server optimization, database integration, and deployment.</p>
          </div>
          <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 dark:border-purple-400/20 dark:from-purple-950/30 dark:to-pink-950/30">
            <h3 className="mb-3 font-bold text-purple-900 dark:text-purple-200">Data & SEO</h3>
            <p className="text-sm text-purple-800 dark:text-purple-300">Data analysis, visualization, machine learning basics, SEO optimization, and performance metrics.</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50/40 to-slate-100/40 p-8 text-center backdrop-blur-sm dark:border-white/10 dark:from-slate-950/40 dark:to-slate-900/40 md:p-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="mb-3 text-2xl font-bold text-slate-950 dark:text-white">Ready to build something amazing?</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">Let's discuss your project and how I can help bring your vision to life.</p>
          <Link to="/contact" className="btn-primary">
            Get in Touch
          </Link>
        </motion.div>
      </section>
    </>
  );
}

export default Skills;
