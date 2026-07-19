import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiClock, FiGlobe, FiLayers, FiMapPin, FiZap } from "react-icons/fi";
import SEO from "../components/SEO";
import { profile, professionalProfile } from "../data/portfolio";

const infoCards = [
  { label: "Availability", value: professionalProfile.availability, icon: FiBriefcase },
  { label: "Work Mode", value: professionalProfile.workMode, icon: FiGlobe },
  { label: "Current Role", value: professionalProfile.currentRole, icon: FiZap },
  { label: "Company", value: professionalProfile.company, icon: FiLayers },
  { label: "Duration", value: professionalProfile.duration, icon: FiClock },
  { label: "Location", value: profile.location, icon: FiMapPin },
];

function Counter({ value, suffix, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 36;
    const interval = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      setCount(Math.round(value * progress));

      if (progress >= 1) {
        window.clearInterval(interval);
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [value]);

  return (
    <div className="glass-card p-5">
      <strong className="block text-4xl font-black text-slate-950 dark:text-white">
        {count}
        {suffix}
      </strong>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

function About() {
  return (
    <>
      <SEO
        title="About Aditaya Kumar Mishra"
        path="/about"
        description="About Aditaya Kumar Mishra, also known as Aditaya and Aditya Mishra. Full Stack MERN Developer focused on React, Vite, Node.js, MongoDB, AI web apps, SEO, testing, and modern product delivery."
        keywords={["About Aditaya", "Aditaya Mishra about", "Aditya Mishra about", "Aditaya Kumar Mishra bio", "Aditaya developer profile"]}
      />
      <section className="page-section">
        <motion.div
          className="grid gap-8 xl:grid-cols-[0.86fr_1.14fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <div className="space-y-5">
              <span className="eyebrow">About Me</span>
              <h1 className="page-title">About Aditaya Kumar Mishra, full-stack developer with product discipline and SEO depth.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                I build polished digital experiences that feel credible to recruiters, useful to teams, and trustworthy to clients. My work sits at the intersection of full-stack delivery, technical SEO, testing, and practical product thinking.
              </p>
            </div>

            <div className="glass-panel relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_34%)]" />
              <img
                src={profile.image}
                alt="Aditaya Kumar Mishra portrait"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/Aditaya.png";
                }}
                width="700"
                height="700"
                className="aspect-square w-full rounded-[2rem] border border-slate-200/60 object-cover shadow-card dark:border-white/10 dark:shadow-card-dark"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {professionalProfile.counters.map((counter) => (
                <Counter key={counter.label} value={counter.value} suffix={counter.suffix} label={counter.label} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 md:p-8">
              <div className="space-y-6 text-base leading-8 text-slate-600 dark:text-slate-300">
                <p>
                  I&apos;m a Full Stack Developer and MERN specialist building premium web applications with React, Vite, Node.js, Express, MongoDB, and Tailwind CSS. I care about clean architecture, smooth interactions, and professional product presentation.
                </p>
                <p>
                  My work emphasizes production-ready frontend systems, dependable backend workflows, meaningful dashboards, image handling, routing quality, technical SEO, and cross-browser reliability that teams can trust.
                </p>
                <p>
                  I have hands-on experience across AI-powered creator platforms, community support systems, recruiter-facing product ideas, donation workflows, machine learning projects, journal website testing, metadata optimization, and deployment debugging across Vercel and Render.
                </p>
                <p>
                  Beyond coding, I enjoy solving practical problems through technology, supporting cleaner release quality, and building experiences that feel calm, premium, and easy to understand.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {infoCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="glass-card flex h-full gap-4 p-5"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-500/10 text-lg text-teal-700 dark:text-teal-300">
                      <Icon />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="mt-2 text-base font-semibold leading-7 text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="glass-panel p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Specialization</span>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">What I bring to recruiter and client conversations</h2>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {professionalProfile.specialization.map((item) => (
                  <span key={item} className="tag px-4 py-2 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 md:p-8">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Professional Timeline</span>
              <div className="mt-6 space-y-5">
                {professionalProfile.timeline.map((item, index) => (
                  <div key={`${item.period}-${item.title}`} className="grid gap-4 md:grid-cols-[24px_minmax(0,1fr)]">
                    <div className="relative hidden md:block">
                      <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-teal-500" />
                      {index < professionalProfile.timeline.length - 1 && <span className="absolute left-1/2 top-6 h-[calc(100%+12px)] w-px -translate-x-1/2 bg-slate-200 dark:bg-white/10" />}
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                      <p className="text-xs font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">{item.period}</p>
                      <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.company}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default About;
