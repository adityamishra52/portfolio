import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { FiActivity, FiBarChart2, FiBriefcase, FiCheck, FiCopy, FiLayout, FiSearch, FiSend, FiShield, FiTool } from "react-icons/fi";
import SEO from "../components/SEO";
import { saveHireRequest } from "../utils/storage";
import { trackEvent } from "../lib/analytics";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  projectType: "Portfolio Website",
  budget: "",
  timeline: "",
  message: "",
};

const buildReferenceId = (prefix) => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${random}`;
};

const serviceCards = [
  { icon: FiLayout, title: "Full Stack Web Development", description: "Modern frontend and backend delivery for full user workflows." },
  { icon: FiBriefcase, title: "MERN App Development", description: "React, Node.js, Express, and MongoDB apps with scalable structure." },
  { icon: FiTool, title: "Website Testing & Bug Fixing", description: "Fix broken UI, layout issues, routing bugs, and runtime problems." },
  { icon: FiSearch, title: "SEO & Technical Cleanup", description: "SEO cleanup, metadata structure, crawl visibility, and indexing support." },
  { icon: FiActivity, title: "Admin Dashboard Development", description: "Practical dashboards for updates, operations, content, and reporting." },
  { icon: FiBarChart2, title: "Business Website Delivery", description: "Fast, premium, responsive websites tailored to a clear business goal." },
];

const processSteps = ["Requirement Review", "Initial Response", "Project Discussion", "Proposal & Timeline"];

const projectTypes = ["Portfolio Website", "MERN Web App", "Admin Dashboard", "SEO Fix", "Bug Fixing", "Other"];

const trustStats = [
  { value: "5+", label: "real projects delivered" },
  { value: "MERN", label: "specialized product workflow" },
  { value: "SEO", label: "testing and optimization support" },
];

const ctaCards = [
  {
    title: "Best for client work",
    description: "Use this page when you have a project brief, hiring need, internship opportunity, or business requirement.",
  },
  {
    title: "Saved separately",
    description: "Hire inquiries are stored separately from general contact messages and shown in their own admin tab.",
  },
];

function HireSuccessCard({ referenceId, onCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      className="overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(14,165,233,0.16))] p-5 shadow-soft backdrop-blur-xl"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <motion.div
            className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 text-2xl text-emerald-600 dark:text-emerald-300"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.08, 1] }}
            transition={{ duration: 0.45 }}
          >
            <FaCheckCircle />
          </motion.div>
          <div>
            <h3 className="text-xl font-black text-slate-950 dark:text-white">Project Inquiry Submitted</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Thank you for your interest. Your project requirements have been received successfully and added to my hiring dashboard.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Within 24 hours.</p>
          </div>
        </div>
        <button className="btn-secondary w-full sm:w-auto" type="button" onClick={onCopy} aria-label="Copy hire inquiry reference ID">
          Copy Reference ID <FiCopy />
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-white/40 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Reference ID</p>
          <p className="mt-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">{referenceId}</p>
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Next Steps</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {processSteps.map((step) => (
              <li key={step} className="flex items-center gap-2">
                <FiCheck className="shrink-0 text-teal-600 dark:text-teal-300" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function HireMe() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => setSuccess(null), 8000);
    return () => window.clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!copyMessage) return undefined;
    const timer = window.setTimeout(() => setCopyMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [copyMessage]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Valid email is required.";
    if (!form.company.trim()) nextErrors.company = "Company or organization is required.";
    if (!form.projectType.trim()) nextErrors.projectType = "Project type is required.";
    if (!form.budget.trim()) nextErrors.budget = "Budget is required.";
    if (!form.timeline.trim()) nextErrors.timeline = "Timeline is required.";
    if (form.message.trim().length < 20) nextErrors.message = "Message should be at least 20 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleCopyReference = async () => {
    if (!success?.referenceId) return;

    try {
      await navigator.clipboard.writeText(success.referenceId);
      setCopyMessage("Reference ID copied.");
    } catch {
      setCopyMessage("Could not copy reference ID.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(null);
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      trackEvent("Hire Me", "Hire Form Submitted", form.projectType);
      await saveHireRequest(form);
      setForm(initialForm);
      setSuccess({ referenceId: buildReferenceId("HIRE") });
      trackEvent("Hire Me", "Hire Form Success", "Hire Me Page");
    } catch (saveError) {
      trackEvent("Hire Me", "Hire Form Error", saveError.message || "Unknown hire error");
      setSubmitError(saveError.message || "Could not save your hire request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Hire Me"
        path="/hire-me"
        description="Hire Aditaya Kumar Mishra to build fast, modern, SEO-ready web apps, dashboards, and premium business websites."
      />
      <section className="page-section">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 md:p-8 xl:p-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(244,114,182,0.10),transparent_24%)]" />
          <div className="grid gap-8 2xl:grid-cols-[1.04fr_.96fr]">
            <div className="space-y-7">
              <div className="space-y-5">
                <span className="eyebrow">Hire Me</span>
                <h1 className="page-title">Hire me to build fast, modern, SEO-ready web apps.</h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  This page is for professional work, freelance projects, internships, job roles, client inquiries, and
                  product requests that need a serious scope, timeline, and budget discussion.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {trustStats.map((item) => (
                  <div className="glass-card p-5" key={item.label}>
                    <strong className="block text-2xl font-black text-slate-950 dark:text-white">{item.value}</strong>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {serviceCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="glass-panel h-full p-5" key={item.title}>
                      <div className="inline-grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                        <Icon />
                      </div>
                      <h2 className="mt-3 text-base font-black text-slate-950 dark:text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {ctaCards.map((item) => (
                  <div className="glass-panel p-6" key={item.title}>
                    <div className="inline-grid h-9 w-9 place-items-center rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                      <FaCheckCircle />
                    </div>
                    <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
                <div className="glass-panel p-6">
                  <div className="inline-grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <FiShield />
                  </div>
                  <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">Professional flow</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    I review the requirement, send an initial response, clarify scope, and then prepare the proposal and timeline.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 self-start">
              <motion.form
                className="glass-panel grid gap-6 p-6 md:p-7 xl:p-8"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                aria-label="Hire me form"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Project inquiry</span>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">Start a serious project conversation</h2>
                    <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Share project type, budget, timeline, and scope so I can understand the work quickly.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Best for</span>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">Client work and serious inquiries</p>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {success && <HireSuccessCard referenceId={success.referenceId} onCopy={handleCopyReference} />}
                </AnimatePresence>
                {copyMessage && <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">{copyMessage}</p>}

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="form-label">
                    <span>Name</span>
                    <input className="form-input" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Enter your name" aria-invalid={Boolean(errors.name)} />
                    {errors.name && <small className="form-error">{errors.name}</small>}
                  </label>

                  <label className="form-label">
                    <span>Email</span>
                    <input className="form-input" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Enter your email" aria-invalid={Boolean(errors.email)} />
                    {errors.email && <small className="form-error">{errors.email}</small>}
                  </label>

                  <label className="form-label md:col-span-2">
                    <span>Phone</span>
                    <input className="form-input" type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Optional phone number" />
                  </label>
                </div>

                <label className="form-label">
                  <span>Company / Organization</span>
                  <input className="form-input" value={form.company} onChange={(event) => updateField("company", event.target.value)} placeholder="Company, startup, or organization" aria-invalid={Boolean(errors.company)} />
                  {errors.company && <small className="form-error">{errors.company}</small>}
                </label>

                <label className="form-label">
                  <span>Subject</span>
                  <input className="form-input" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="Short summary of the project or role" />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="form-label">
                    <span>Project Type</span>
                    <select className="form-input" value={form.projectType} onChange={(event) => updateField("projectType", event.target.value)} aria-invalid={Boolean(errors.projectType)}>
                      {projectTypes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && <small className="form-error">{errors.projectType}</small>}
                  </label>

                  <label className="form-label">
                    <span>Budget</span>
                    <input className="form-input" value={form.budget} onChange={(event) => updateField("budget", event.target.value)} placeholder="Example: INR 25k - 60k" aria-invalid={Boolean(errors.budget)} />
                    {errors.budget && <small className="form-error">{errors.budget}</small>}
                  </label>

                  <label className="form-label sm:col-span-2">
                    <span>Timeline</span>
                    <input className="form-input" value={form.timeline} onChange={(event) => updateField("timeline", event.target.value)} placeholder="Example: 2-4 weeks" aria-invalid={Boolean(errors.timeline)} />
                    {errors.timeline && <small className="form-error">{errors.timeline}</small>}
                  </label>
                </div>

                <label className="form-label">
                  <span>Message</span>
                  <textarea
                    className="form-input min-h-36 resize-y"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Describe the project, scope, goals, current status, and what kind of help you need."
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <small className="form-error">{errors.message}</small>}
                </label>

                {submitError && <p className="rounded-2xl bg-rose-500/10 p-4 font-semibold text-rose-700 dark:text-rose-300">{submitError}</p>}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Your request is securely stored in my hiring dashboard after the database confirms the submission.
                  </p>
                  <button className="btn-primary" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Send Hire Request"} <FiSend />
                  </button>
                </div>
              </motion.form>

              <motion.div
                className="glass-panel p-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Process</span>
                <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">What happens next</h2>
                <div className="mt-5 grid gap-3">
                  {processSteps.map((step, index) => (
                    <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5" key={step}>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/10 font-black text-teal-700 dark:text-teal-300">
                          {index + 1}
                        </span>
                        <p className="m-0 font-semibold text-slate-700 dark:text-slate-200">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default HireMe;
