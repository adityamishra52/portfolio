import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { education } from "../data/portfolio";

function Education() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <>
      <SEO
        title="Aditaya Education"
        path="/education"
        description="Education details for Aditaya Kumar Mishra, Computer Science and Engineering graduate with hands-on MERN, AI, SEO, and web development project experience."
        keywords={["Aditaya education", "Aditaya Kumar Mishra education", "Aditaya computer science", "Aditaya CSE", "Aditaya academic profile"]}
      />
      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">Education</span>
          <h1 className="page-title">Aditaya Kumar Mishra education: computer science foundation with hands-on product depth</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Structured education combined with real-world development experience, building production applications alongside formal studies.
          </p>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {education.map((item, index) => (
            <motion.article
              className="group flex flex-col gap-5 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white/70 to-white/50 p-6 shadow-card transition hover:border-teal-400/50 hover:-translate-y-1 dark:border-white/10 dark:from-slate-950/50 dark:to-slate-950/30 dark:shadow-card-dark"
              key={item.degree}
              variants={cardVariants}
            >
              <div>
                <span className="inline-flex rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300">
                  {item.detail}
                </span>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 dark:text-white">{item.degree}</h2>
                <p className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-300">{item.school}</p>
              </div>

              <div className="border-t border-slate-200/50 pt-5 dark:border-white/10">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Comprehensive curriculum in data structures, algorithms, software engineering, databases, and modern web technologies.
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Additional context */}
        <motion.div
          className="mt-16 rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50/40 to-slate-100/40 p-8 dark:border-white/10 dark:from-slate-950/40 dark:to-slate-900/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-3 text-xl font-bold text-slate-950 dark:text-white">Beyond the Classroom</h3>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            While pursuing my degree, I've built production web applications, completed professional internships, worked on AI-powered platforms, and contributed to real-world SEO optimization. This hands-on experience complements formal computer science education with practical, market-ready skills.
          </p>
        </motion.div>
      </section>
    </>
  );
}

export default Education;
