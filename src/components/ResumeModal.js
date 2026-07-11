import { useEffect } from "react";
import { FiDownload, FiExternalLink, FiFileText, FiX } from "react-icons/fi";
import { profile } from "../data/portfolio";
import { trackEvent } from "../lib/analytics";

function ResumeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const label = profile.resumeLabel || "Aditaya Kumar Mishra CV";

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/70 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white text-slate-950 shadow-2xl dark:border-white/10 dark:bg-slate-950 dark:text-white">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 p-5 dark:border-white/10">
          <div className="flex gap-4">
            <div className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-500/10 text-2xl text-teal-700 dark:text-teal-300">
              <FiFileText />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Resume / CV</p>
              <h2 id="resume-modal-title" className="mt-1 text-xl font-black leading-tight text-slate-950 dark:text-white">
                {label}
              </h2>
            </div>
          </div>
          <button className="icon-btn shrink-0" type="button" onClick={onClose} aria-label="Close CV popup">
            <FiX />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Open the CV in a new tab or download the Word document directly.
            </p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-500 dark:text-slate-400">File type</span>
                <strong className="text-slate-900 dark:text-white">DOCX</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Owner</span>
                <strong className="text-right text-slate-900 dark:text-white">{profile.name}</strong>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              className="btn-primary w-full"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("Resume", "CV Open Click", "Resume Modal")}
            >
              Open CV <FiExternalLink />
            </a>
            <a
              className="btn-secondary w-full"
              href={profile.resume}
              download="Aditaya_Kumar_Mishra_CV.docx"
              onClick={() => trackEvent("Resume", "CV Download Click", "Resume Modal")}
            >
              Download <FiDownload />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeModal;
