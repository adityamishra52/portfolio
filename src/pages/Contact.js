import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiArrowRight, FiCheckCircle, FiCopy, FiHelpCircle, FiMail, FiMessageSquare, FiPhone, FiSend, FiUsers } from "react-icons/fi";
import SEO from "../components/SEO";
import { profile } from "../data/portfolio";
import { saveContactMessage } from "../utils/storage";
import { trackEvent } from "../lib/analytics";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const buildReferenceId = (prefix) => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${random}`;
};

const contactCards = [
  { icon: FiMail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, cta: "Send Email", accent: "bg-teal-500/10 text-teal-700 dark:text-teal-300" },
  { icon: FiPhone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, cta: "Call Now", accent: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" },
  { icon: FaGithub, label: "GitHub", value: "github.com/adityamishra52", href: profile.github, cta: "Open Profile", accent: "bg-slate-950/10 text-slate-700 dark:bg-white/10 dark:text-white" },
  { icon: FaLinkedin, label: "LinkedIn", value: "linkedin.com/in/aditaya-kumar-mishra", href: profile.linkedin, cta: "View Profile", accent: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "+91 6360847309",
    href: "https://wa.me/916360847309",
    cta: "Click to Chat",
    accent: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    special: true,
  },
];

const quickContact = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "WhatsApp", value: "+91 6360847309", href: "https://wa.me/916360847309" },
  { label: "LinkedIn", value: "LinkedIn Profile", href: profile.linkedin },
];

const reasonCards = [
  {
    icon: FiMessageSquare,
    title: "General message",
    description: "Use this page for quick questions, feedback, introductions, or collaboration ideas.",
  },
  {
    icon: FiUsers,
    title: "Collaboration",
    description: "Share partnership ideas, product collaboration plans, or community opportunities.",
  },
  {
    icon: FiHelpCircle,
    title: "Support or clarification",
    description: "Ask about a project, portfolio item, workflow, or technical detail.",
  },
];

const faqCards = [
  {
    question: "When should I use Contact instead of Hire Me?",
    answer: "Use Contact for general communication, feedback, and questions. Use Hire Me for serious project, internship, or freelance inquiries.",
  },
  {
    question: "Will my message be saved?",
    answer: "Yes. Contact messages are saved to the shared portfolio inbox and shown in the admin dashboard as Contact Messages.",
  },
  {
    question: "Can I ask about an existing project?",
    answer: "Absolutely. You can ask about implementation choices, stack details, bugs, or collaboration around any listed project.",
  },
];

function SuccessCard({ referenceId, onCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      className="overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(59,130,246,0.12))] p-5 shadow-soft backdrop-blur-xl"
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
            <FiCheckCircle />
          </motion.div>
          <div>
            <h3 className="text-xl font-black text-slate-950 dark:text-white">Message Received Successfully</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Thank you for contacting me. Your message has been securely submitted and stored in my professional dashboard.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Usually within 24-48 hours.</p>
          </div>
        </div>
        <button className="btn-secondary w-full sm:w-auto" type="button" onClick={onCopy} aria-label="Copy message reference ID">
          Copy Reference ID <FiCopy />
        </button>
      </div>
      <div className="mt-4 rounded-2xl border border-white/40 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Reference ID</p>
        <p className="mt-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">{referenceId}</p>
      </div>
    </motion.div>
  );
}

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const premiumContactCards = useMemo(() => contactCards, []);

  useEffect(() => {
    if (!success) return undefined;

    const timer = window.setTimeout(() => setSuccess(null), 5000);
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
    if (!form.subject.trim()) nextErrors.subject = "Subject is required.";
    if (form.message.trim().length < 10) nextErrors.message = "Message should be at least 10 characters.";
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
      trackEvent("Contact", "Contact Form Submitted", form.subject.trim());
      await saveContactMessage(form);
      setForm(initialForm);
      setSuccess({ referenceId: buildReferenceId("MSG") });
      trackEvent("Contact", "Contact Form Success", "Contact Page");
    } catch (saveError) {
      trackEvent("Contact", "Contact Form Error", saveError.message || "Unknown contact error");
      setSubmitError(saveError.message || "Could not save your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        path="/contact"
        description="Send a message, collaboration idea, feedback, or question to Aditaya Kumar Mishra."
      />
      <section className="page-section">
        <div className="grid gap-8 2xl:grid-cols-[0.96fr_1.04fr]">
          <motion.div className="space-y-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-5">
              <span className="eyebrow">Contact</span>
              <h1 className="page-title">Send a message, collaboration idea, feedback, or question.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                This page is for general communication. Ask something, share feedback, start a conversation, or reach out
                about collaboration without needing a full project brief.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {premiumContactCards.map((item) => {
                const Icon = item.icon;
                const external = item.href.startsWith("http");
                return (
                  <a
                    className={`glass-card group flex min-h-[196px] flex-col justify-between p-5 shadow-card hover:shadow-xl ${
                      item.special ? "border-emerald-400/30 bg-[linear-gradient(135deg,rgba(34,197,94,0.16),rgba(16,185,129,0.08))]" : ""
                    }`}
                    href={item.href}
                    key={item.label}
                    rel={external ? "noreferrer" : undefined}
                    target={external ? "_blank" : undefined}
                    aria-label={`${item.label}: ${item.value}`}
                    onClick={() => {
                      if (item.label === "GitHub") trackEvent("Social", "GitHub Click", "Contact Card");
                      if (item.label === "LinkedIn") trackEvent("Social", "LinkedIn Click", "Contact Card");
                      if (item.label === "WhatsApp") trackEvent("Social", "WhatsApp Click", "Contact Card");
                      if (item.label === "Email") trackEvent("Social", "Email Click", "Contact Card");
                    }}
                  >
                    <div className={`inline-grid h-12 w-12 place-items-center rounded-2xl text-xl ${item.accent}`}>
                      <Icon />
                    </div>
                    <div className="space-y-3">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</span>
                      <p className="text-base font-semibold leading-7 text-slate-950 dark:text-white">{item.value}</p>
                    </div>
                    <span className="text-sm font-bold text-teal-700 transition group-hover:translate-x-1 dark:text-teal-300">{item.cta}</span>
                  </a>
                );
              })}
            </div>

            <div className="glass-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick Contact</span>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Fastest ways to reach me</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quickContact.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 transition hover:-translate-y-0.5 hover:border-teal-400/50 dark:border-white/10 dark:bg-white/5"
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    onClick={() => trackEvent("Social", `${item.label} Click`, "Quick Contact")}
                  >
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reasonCards.map((item) => {
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
          </motion.div>

          <div className="grid gap-5 self-start">
            <motion.form
              className="glass-panel grid gap-6 p-6 md:p-7 xl:p-8"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              aria-label="Contact form"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Contact form</span>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">Quick message form</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    General contact, questions, collaboration, feedback, or messages all belong here.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Response type</span>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">General communication</p>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {success && <SuccessCard referenceId={success.referenceId} onCopy={handleCopyReference} />}
              </AnimatePresence>
              {copyMessage && <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">{copyMessage}</p>}

              <div className="grid gap-5 md:grid-cols-2">
                {["name", "email", "phone"].map((field) => (
                  <label className={`form-label ${field === "phone" ? "md:col-span-2" : ""}`} key={field}>
                    <span>{field[0].toUpperCase() + field.slice(1)}</span>
                    <input
                      className="form-input"
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      placeholder={field === "phone" ? "Optional phone number" : `Enter your ${field}`}
                      aria-invalid={Boolean(errors[field])}
                    />
                    {errors[field] && <small className="form-error">{errors[field]}</small>}
                  </label>
                ))}
              </div>

              <label className="form-label">
                <span>Subject</span>
                <input
                  className="form-input"
                  type="text"
                  value={form.subject}
                  onChange={(event) => updateField("subject", event.target.value)}
                  placeholder="What is this about?"
                  aria-invalid={Boolean(errors.subject)}
                />
                {errors.subject && <small className="form-error">{errors.subject}</small>}
              </label>

              <label className="form-label">
                <span>Message</span>
                <textarea
                  className="form-input min-h-36 resize-y"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Tell me what you want to discuss..."
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <small className="form-error">{errors.message}</small>}
              </label>

              {submitError && <p className="rounded-2xl bg-rose-500/10 p-4 font-semibold text-rose-700 dark:text-rose-300">{submitError}</p>}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Your message is securely stored in my professional dashboard after the database confirms the submission.
                </p>
                <button className="btn-primary" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Send Message"} <FiSend />
                </button>
              </div>
            </motion.form>

            <motion.div
              className="glass-panel p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick FAQ</span>
                  <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Before you send</h2>
                </div>
                <Link className="btn-secondary" to="/hire-me" onClick={() => trackEvent("Navigation", "Menu Click", "Contact Hire Me")}>
                  Hire Me <FiArrowRight />
                </Link>
              </div>
              <div className="grid gap-3">
                {faqCards.map((item) => (
                  <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5" key={item.question}>
                    <p className="font-black text-slate-950 dark:text-white">{item.question}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
