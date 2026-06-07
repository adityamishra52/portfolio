import { useMemo, useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiTrash2 } from "react-icons/fi";
import SEO from "../components/SEO";
import {
  deleteContactMessage,
  deleteHireRequest,
  getContactMessages,
  getHireRequests,
  getSubmissionStats,
  setContactMessageRead,
  setHireRequestRead,
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
  const [contactMessages, setContactMessages] = useState([]);
  const [hireRequests, setHireRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");
  const [actionId, setActionId] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const adminKey = import.meta.env.VITE_ADMIN_KEY?.trim();

  const contactStats = useMemo(() => getSubmissionStats(contactMessages), [contactMessages]);
  const hireStats = useMemo(() => getSubmissionStats(hireRequests), [hireRequests]);
  const currentEntries = activeTab === "contact" ? contactMessages : hireRequests;
  const currentStats = activeTab === "contact" ? contactStats : hireStats;

  const login = async (event) => {
    event.preventDefault();

    if (!adminKey) {
      setError("VITE_ADMIN_KEY is missing. Add it to your environment before using the admin dashboard.");
      return;
    }

    if (key !== adminKey) {
      setError("Invalid admin key.");
      return;
    }

    setIsLoading(true);
    setError("");
    setDashboardError("");
    setFallbackNotice("");

    try {
      const [contactResult, hireResult] = await Promise.all([getContactMessages(key), getHireRequests(key)]);
      setContactMessages(contactResult.entries);
      setHireRequests(hireResult.entries);
      setAuthenticated(true);

      const notices = [contactResult, hireResult]
        .filter((result) => result.source === "fallback")
        .map((result) => result.errorMessage)
        .filter(Boolean);

      if (notices.length > 0) {
        setFallbackNotice("Database data is temporarily unavailable, so the dashboard is showing only this device's fallback cache.");
      }
    } catch (loadError) {
      setError(loadError.message || "Could not load admin data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (entry) => {
    setDashboardError("");
    setActionId(entry.id);

    try {
      if (activeTab === "contact") {
        const updatedEntry = await setContactMessageRead(entry.id, !entry.read, key);
        setContactMessages((current) => current.map((item) => (item.id === updatedEntry.id ? updatedEntry : item)));
        return;
      }

      const updatedEntry = await setHireRequestRead(entry.id, !entry.read, key);
      setHireRequests((current) => current.map((item) => (item.id === updatedEntry.id ? updatedEntry : item)));
    } catch (actionError) {
      setDashboardError(actionError.message || "Could not update message status.");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (id) => {
    setDashboardError("");
    setActionId(id);

    try {
      if (activeTab === "contact") {
        const nextEntries = await deleteContactMessage(id, key);
        setContactMessages(nextEntries);
      } else {
        const nextEntries = await deleteHireRequest(id, key);
        setHireRequests(nextEntries);
      }

      setExpandedId((current) => (current === id ? "" : current));
    } catch (actionError) {
      setDashboardError(actionError.message || "Could not delete this message.");
    } finally {
      setActionId("");
    }
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
              Enter the private admin key to view contact messages and hire requests stored in the shared database.
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
            <button className="btn-primary mt-6 w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Checking..." : "Login"}
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

            {fallbackNotice && <div className="mb-6 rounded-2xl bg-amber-500/10 p-4 font-semibold text-amber-700 dark:text-amber-300">{fallbackNotice}</div>}
            {dashboardError && <div className="mb-6 rounded-2xl bg-rose-500/10 p-4 font-semibold text-rose-700 dark:text-rose-300">{dashboardError}</div>}

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
              {isLoading ? (
                <div className="glass-panel p-8 text-slate-600 dark:text-slate-300">Loading messages...</div>
              ) : currentEntries.length === 0 ? (
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
                        <button
                          className="btn-secondary"
                          type="button"
                          onClick={() => setExpandedId((current) => (current === entry.id ? "" : entry.id))}
                        >
                          {expandedId === entry.id ? "Hide Message" : "View Message"} {expandedId === entry.id ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button className="btn-secondary" type="button" disabled={actionId === entry.id} onClick={() => handleToggleRead(entry)}>
                          Mark {entry.read ? "Unread" : "Read"}
                        </button>
                        <button className="btn-secondary text-rose-600 dark:text-rose-300" disabled={actionId === entry.id} type="button" onClick={() => handleDelete(entry.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    {expandedId === entry.id && <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">{entry.message}</p>}
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
