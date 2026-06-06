import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { experiences } from "../data/portfolio";

function Experience() {
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

  return (
    <>
      <SEO
        title="Experience"
        path="/experience"
        description="Work experience of Aditaya Kumar Mishra including Manuscript Technomedia LLP, website testing, SEO, React, Vite, Node.js, MongoDB, Vercel, and Render."
      />
      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">Work Experience</span>
          <h1 className="page-title">Real-world development, testing, SEO, and deployment work</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Hands-on experience building production web applications, testing complex systems, optimizing for search engines, and managing cloud deployments.
          </p>
        </div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {experiences.map((item, index) => (
            <motion.article
              className="glass-card overflow-hidden"
              key={`${item.company}-${item.title}`}
              variants={cardVariants}
            >
              <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-xs font-black text-teal-700 dark:text-teal-300">
                      {item.duration}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950 dark:text-white">{item.title}</h2>
                  <p className="mt-2 text-base font-semibold text-teal-700 dark:text-teal-300">{item.company}</p>
                </div>
              </div>

              <div className="border-t border-slate-200/50 px-6 py-6 dark:border-white/10 md:px-8">
                <span className="mb-4 inline-block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Key Responsibilities
                </span>
                <ul className="grid gap-3 md:grid-cols-2">
                  {item.responsibilities.map((responsibility) => (
                    <li
                      key={responsibility}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/50 bg-slate-50/50 p-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    >
                      <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </>
  );
}

export default Experience;
