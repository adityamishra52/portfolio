import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowRight, FiHelpCircle, FiMail, FiMessageSquare, FiPhone, FiSend, FiUsers } from "react-icons/fi";
import SEO from "../components/SEO";
import { profile } from "../data/portfolio";
import { saveContactMessage } from "../utils/storage";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const contactCards = [
  { icon: FiMail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: FiPhone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { icon: FaGithub, label: "GitHub", value: "github.com/adityamishra52", href: profile.github },
  { icon: FaLinkedin, label: "LinkedIn", value: "linkedin.com/in/aditaya-kumar-mishra", href: profile.linkedin },
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

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await saveContactMessage(form);
      setForm(initialForm);
      setSuccess(result.message || "Message saved successfully. I will check it from the admin dashboard.");
    } catch (saveError) {
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
        <div className="grid gap-8 xl:grid-cols-[0.94fr_1.06fr]">
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-5">
              <span className="eyebrow">Contact</span>
              <h1 className="page-title">Send a message, collaboration idea, feedback, or question.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                This page is for general communication. Ask something, share feedback, start a conversation, or reach out
                about collaboration without needing a full project brief.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactCards.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    className="glass-card flex min-h-[116px] flex-col justify-between p-5"
                    href={item.href}
                    key={item.label}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                  >
                    <div className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-teal-500/10 text-xl text-teal-700 dark:text-teal-300">
                      <Icon />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</span>
                      <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reasonCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="glass-panel p-5" key={item.title}>
                    <div className="inline-grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
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
              className="glass-panel grid gap-5 p-6 md:p-7"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
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

              <div className="grid gap-5 md:grid-cols-2">
                {["name", "email", "phone"].map((field) => (
                  <label className="form-label" key={field}>
                    <span>{field[0].toUpperCase() + field.slice(1)}</span>
                    <input
                      className="form-input"
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      placeholder={field === "phone" ? "Optional phone number" : `Enter your ${field}`}
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
                />
                {errors.subject && <small className="form-error">{errors.subject}</small>}
              </label>

              <label className="form-label">
                <span>Message</span>
                <textarea
                  className="form-input min-h-32 resize-y"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Tell me what you want to discuss..."
                />
                {errors.message && <small className="form-error">{errors.message}</small>}
              </label>

              {submitError && <p className="rounded-2xl bg-rose-500/10 p-4 font-semibold text-rose-700 dark:text-rose-300">{submitError}</p>}
              {success && <p className="rounded-2xl bg-emerald-500/10 p-4 font-semibold text-emerald-700 dark:text-emerald-300">{success}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Saved as a shared contact message in the admin dashboard after the database confirms the submission.</p>
                <button className="btn-primary" type="submit" disabled={isSubmitting}>
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
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick FAQ</span>
                  <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Before you send</h2>
                </div>
                <Link className="btn-secondary" to="/hire-me">
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
