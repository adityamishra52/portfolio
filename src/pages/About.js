import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { profile } from "../data/portfolio";

function About() {
  return (
    <>
      <SEO
        title="About"
        path="/about"
        description="About Aditaya Kumar Mishra, Full Stack MERN Developer focused on React, Vite, Node.js, MongoDB, AI web apps, SEO, and modern product delivery."
      />
      <section className="page-section">
        <motion.div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <span className="eyebrow">About Me</span>
            <h1 className="page-title">Full-stack developer with a product-first mindset</h1>
            <img
              src={profile.image}
              alt="Aditaya Kumar Mishra"
              className="mt-10 aspect-square w-full max-w-sm rounded-3xl border border-slate-200/60 object-cover shadow-card dark:border-white/10 dark:shadow-card-dark"
            />
          </div>
          <div className="glass-panel space-y-6 p-6 md:p-8">
            <div className="space-y-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                I'm a Full Stack Developer and MERN Stack specialist building premium web applications with React, Vite, Node.js, Express, MongoDB, and Tailwind CSS. I focus on clean architecture, smooth user experiences, and modern development practices.
              </p>
              <p>
                My work emphasizes production-ready code with clean UI patterns, efficient routing, meaningful dashboards, SEO-optimized public pages, and practical workflows that teams and clients can understand immediately.
              </p>
              <p>
                I have hands-on experience developing AI-powered creator platforms, community support systems, resume optimization tools, machine learning projects, comprehensive website testing, journal platform SEO, metadata optimization, and deployment debugging across Vercel and Render.
              </p>
              <p>
                Beyond coding, I'm passionate about solving real problems through technology, mentoring other developers, and building products that users genuinely find valuable and easy to use.
              </p>
            </div>

            <div className="grid gap-4 border-t border-slate-200/50 pt-6 dark:border-white/10">
              <div>
                <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Currently</span>
                <p className="mt-2 font-semibold text-slate-950 dark:text-white">Website Testing & SEO Executive</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manuscript Technomedia LLP - Full-time</p>
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Location</span>
                <p className="mt-2 font-semibold text-slate-950 dark:text-white">{profile.location}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default About;
