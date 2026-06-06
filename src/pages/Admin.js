import { useMemo, useState } from "react";
import { FiLock, FiTrash2 } from "react-icons/fi";
import SEO from "../components/SEO";
import {
  deleteContactMessage,
  deleteHireRequest,
  getContactMessages,
  getHireRequests,
  getSubmissionStats,
  toggleContactMessageRead,
  toggleHireRequestRead,
} from "../utils/storage";

const adminTabs = [
  { key: "contact", label: "Contact Messages" },
  { key: "hire", label: "Hire Me Requests" },
];

function Admin() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("contact");
  const [contactMessages, setContactMessages] = useState(() => getContactMessages());
  const [hireRequests, setHireRequests] = useState(() => getHireRequests());
  const adminKey = import.meta.env.VITE_ADMIN_KEY || "your-secret-key";

  const contactStats = useMemo(() => getSubmissionStats(contactMessages), [contactMessages]);
  const hireStats = useMemo(() => getSubmissionStats(hireRequests), [hireRequests]);
  const currentEntries = activeTab === "contact" ? contactMessages : hireRequests;
  const currentStats = activeTab === "contact" ? contactStats : hireStats;

  const login = (event) => {
    event.preventDefault();
    if (key === adminKey) {
      setAuthenticated(true);
      setError("");
      setContactMessages(getContactMessages());
      setHireRequests(getHireRequests());
      return;
    }
    setError("Invalid admin key.");
  };

  const handleToggleRead = (id) => {
    if (activeTab === "contact") {
      setContactMessages(toggleContactMessageRead(id));
      return;
    }
    setHireRequests(toggleHireRequestRead(id));
  };

  const handleDelete = (id) => {
    if (activeTab === "contact") {
      setContactMessages(deleteContactMessage(id));
      return;
    }
    setHireRequests(deleteHireRequest(id));
  };

  return (
    <>
      <SEO
        title="Admin"
        path="/admin-aditaya"
        description="Private admin dashboard for Aditaya Kumar Mishra portfolio contact messages and hire requests."
        robots="noindex, nofollow"
      />
      <section className="page-section">
        {!authenticated ? (
          <form className="glass-panel mx-auto max-w-lg p-6 md:p-8" onSubmit={login}>
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl text-teal-700 dark:text-teal-300">
              <FiLock />
            </div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">Admin Login</h1>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Enter the private admin key to view contact messages and hire requests stored in localStorage.
            </p>
            <label className="form-label mt-6">
              <span>Secret Key</span>
              <input
                className="form-input"
                type="password"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="Enter admin key"
              />
            </label>
            {error && <p className="form-error mt-3">{error}</p>}
            <button className="btn-primary mt-6 w-full" type="submit">
              Login
            </button>
          </form>
        ) : (
          <div>
            <div className="section-heading">
              <span className="eyebrow">Private Dashboard</span>
              <h1 className="page-title">Message Center</h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Contact messages and hire inquiries are separated here so you can manage general communication and
                professional requests independently.
              </p>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              {adminTabs.map((tab) => {
                const unreadCount = tab.key === "contact" ? contactStats.unread : hireStats.unread;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-black transition ${
                      isActive
                        ? "bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950"
                        : "border border-slate-200/80 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    <span className={`rounded-full px-2.5 py-1 text-xs ${isActive ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-950" : "bg-teal-500/10 text-teal-700 dark:text-teal-300"}`}>
                      {unreadCount} unread
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="glass-card p-5">
                <span className="text-sm font-black text-slate-500 dark:text-slate-400">Total Entries</span>
                <strong className="mt-2 block text-4xl text-slate-950 dark:text-white">{currentStats.total}</strong>
              </div>
              <div className="glass-card p-5">
                <span className="text-sm font-black text-slate-500 dark:text-slate-400">Unread Entries</span>
                <strong className="mt-2 block text-4xl text-slate-950 dark:text-white">{currentStats.unread}</strong>
              </div>
              <div className="glass-card p-5">
                <span className="text-sm font-black text-slate-500 dark:text-slate-400">Recent Entries</span>
                <strong className="mt-2 block text-4xl text-slate-950 dark:text-white">{currentStats.recent.length}</strong>
              </div>
            </div>

            <div className="grid gap-4">
              {currentEntries.length === 0 ? (
                <div className="glass-panel p-8 text-slate-600 dark:text-slate-300">
                  {activeTab === "contact" ? "No contact messages yet." : "No hire requests yet."}
                </div>
              ) : (
                currentEntries.map((entry) => (
                  <article className="glass-panel p-5" key={entry.id}>
                    <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-black text-slate-950 dark:text-white">
                            {activeTab === "contact" ? entry.subject : entry.projectType}
                          </h2>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${entry.read ? "bg-slate-500/10 text-slate-500" : "bg-teal-500/10 text-teal-700 dark:text-teal-300"}`}>
                            {entry.read ? "Read" : "Unread"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {entry.name} - {entry.email} - {new Date(entry.createdAt).toLocaleString()}
                        </p>
                        {activeTab === "hire" && (
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/5">
                              <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Organization</span>
                              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{entry.company}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/5">
                              <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Budget</span>
                              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{entry.budget}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/5">
                              <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Timeline</span>
                              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{entry.timeline}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="btn-secondary" type="button" onClick={() => handleToggleRead(entry.id)}>
                          Mark {entry.read ? "Unread" : "Read"}
                        </button>
                        <button className="btn-secondary text-rose-600 dark:text-rose-300" type="button" onClick={() => handleDelete(entry.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">{entry.message}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Admin;
