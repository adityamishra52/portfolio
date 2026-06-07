import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArchive,
  FiBarChart2,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCopy,
  FiDownload,
  FiEye,
  FiFilter,
  FiInbox,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiSettings,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import SEO from "../components/SEO";
import {
  clearAdminSession,
  deleteAdminMessage,
  exportAdminMessages,
  getAdminMessages,
  getAdminOverview,
  getAdminSession,
  saveAdminSession,
  updateAdminMessage,
} from "../utils/storage";

const sidebarTabs = [
  { key: "overview", label: "Overview", icon: FiBarChart2 },
  { key: "contact", label: "Contact Messages", icon: FiMail },
  { key: "hire", label: "Hire Me Requests", icon: FiUsers },
  { key: "archived", label: "Archived", icon: FiArchive },
  { key: "settings", label: "Settings", icon: FiSettings },
];

const statusOptions = ["new", "read", "replied", "archived"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

const initialFilters = {
  search: "",
  status: "",
  source: "",
  sort: "newest",
  dateFrom: "",
  dateTo: "",
  page: 1,
  limit: 10,
};

const statusTone = {
  new: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  read: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  replied: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  archived: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const sourceTone = {
  contact: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "hire-me": "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const buildQueryForTab = (tab, filters) => {
  const query = {
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };

  if (tab === "contact") query.type = "contact";
  if (tab === "hire") query.type = "hire";
  if (tab === "archived") query.type = filters.source || "all";
  if (tab !== "archived" && filters.source) query.type = filters.source === "hire-me" ? "hire" : "contact";
  if (!query.type) query.type = "all";

  if (tab === "archived") {
    query.status = "archived";
  } else if (filters.status) {
    query.status = filters.status;
  }

  return query;
};

const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

function Admin() {
  const [key, setKey] = useState(() => getAdminSession()?.key || "");
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminSession()?.authenticated));
  const [error, setError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNext: false, hasPrevious: false });
  const [filters, setFilters] = useState(initialFilters);
  const [drawerMessage, setDrawerMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const uiAdminKey = import.meta.env.VITE_ADMIN_KEY?.trim();

  const currentQuery = useMemo(() => buildQueryForTab(activeTab, filters), [activeTab, filters]);

  const login = async (event) => {
    event.preventDefault();
    setError("");

    if (!key.trim()) {
      setError("Enter your admin key.");
      return;
    }

    if (uiAdminKey && key.trim() !== uiAdminKey) {
      setError("Invalid admin key.");
      return;
    }

    setIsOverviewLoading(true);

    try {
      const [overviewResult, recentResult] = await Promise.all([
        getAdminOverview(key.trim()),
        getAdminMessages(key.trim(), { type: "all", limit: 5, page: 1, sort: "newest" }),
      ]);

      setOverview(overviewResult.overview);
      setRecentMessages(recentResult.entries);
      setAuthenticated(true);
      saveAdminSession({ authenticated: true, key: key.trim() });
    } catch (loginError) {
      setError(loginError.message || "Could not open the admin dashboard.");
      clearAdminSession();
    } finally {
      setIsOverviewLoading(false);
    }
  };

  const loadOverview = async (adminKey) => {
    setIsOverviewLoading(true);
    try {
      const [overviewResult, recentResult] = await Promise.all([
        getAdminOverview(adminKey),
        getAdminMessages(adminKey, { type: "all", limit: 5, page: 1, sort: "newest" }),
      ]);
      setOverview(overviewResult.overview);
      setRecentMessages(recentResult.entries);
    } catch (loadError) {
      setDashboardError(loadError.message || "Could not load overview data.");
    } finally {
      setIsOverviewLoading(false);
    }
  };

  const loadMessages = async (adminKey) => {
    if (activeTab === "overview" || activeTab === "settings") return;

    setIsLoading(true);
    setDashboardError("");

    try {
      const result = await getAdminMessages(adminKey, currentQuery);
      setMessages(result.entries);
      setPagination(result.pagination);
    } catch (loadError) {
      setDashboardError(loadError.message || "Could not load messages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated || !key.trim()) return;

    if (activeTab === "overview") {
      loadOverview(key.trim());
      return;
    }

    if (activeTab === "settings") return;

    loadMessages(key.trim());
  }, [authenticated, key, activeTab, currentQuery]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setDrawerMessage(null);
    setFilters((current) => ({
      ...current,
      page: 1,
      status: tab === "archived" ? "" : current.status,
      source: tab === "contact" ? "contact" : tab === "hire" ? "hire-me" : current.source,
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 1,
    }));
  };

  const refreshCurrentView = async () => {
    if (!key.trim()) return;
    if (activeTab === "overview") {
      await loadOverview(key.trim());
      return;
    }

    await loadMessages(key.trim());
  };

  const handleStatusUpdate = async (message, status) => {
    setActionId(message.id);
    setDashboardError("");

    try {
      const result = await updateAdminMessage(key.trim(), message.id, {
        type: message.source === "hire-me" ? "hire" : "contact",
        status,
      });

      setMessages((current) => current.map((item) => (item.id === result.entry.id ? result.entry : item)));
      setDrawerMessage((current) => (current?.id === result.entry.id ? result.entry : current));
      await Promise.all([refreshCurrentView(), loadOverview(key.trim())]);
    } catch (actionError) {
      setDashboardError(actionError.message || "Could not update this message.");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (message) => {
    setActionId(message.id);
    setDashboardError("");

    try {
      await deleteAdminMessage(key.trim(), message.id, message.source === "hire-me" ? "hire" : "contact");
      setDrawerMessage((current) => (current?.id === message.id ? null : current));
      await refreshCurrentView();
      await loadOverview(key.trim());
    } catch (actionError) {
      setDashboardError(actionError.message || "Could not delete this message.");
    } finally {
      setActionId("");
    }
  };

  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setDashboardError(`Could not copy ${label}.`);
    }
  };

  const handleExport = async (type) => {
    setIsExporting(true);
    setDashboardError("");

    try {
      const blob = await exportAdminMessages(key.trim(), {
        ...currentQuery,
        type,
      });
      triggerDownload(blob, `${type}-messages.csv`);
    } catch (exportError) {
      setDashboardError(exportError.message || "Could not export messages.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setAuthenticated(false);
    setDrawerMessage(null);
    setMessages([]);
    setOverview(null);
    setRecentMessages([]);
    setFilters(initialFilters);
  };

  const statCards = overview
    ? [
        { label: "Total Contact Messages", value: overview.totalContactMessages, icon: FiMail },
        { label: "Total Hire Requests", value: overview.totalHireRequests, icon: FiUsers },
        { label: "New / Active Messages", value: overview.newMessages, icon: FiInbox },
        { label: "Replied Messages", value: overview.repliedMessages, icon: FiCheckCircle },
        { label: "Archived Messages", value: overview.archivedMessages, icon: FiArchive },
        { label: "Latest Message Date", value: overview.latestMessageDate ? new Date(overview.latestMessageDate).toLocaleString() : "No messages", icon: FiClock },
      ]
    : [];

  return (
    <>
      <SEO title="Admin" path="/admin-aditaya" description="Private CRM dashboard." robots="noindex, nofollow" />
      <section className="page-section">
        {!authenticated ? (
          <form className="glass-panel mx-auto max-w-lg p-6 md:p-8" onSubmit={login}>
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl text-teal-700 dark:text-teal-300">
              <FiLock />
            </div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">Admin CRM Login</h1>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Enter the private admin key to open the shared MongoDB message system.
            </p>
            <label className="form-label mt-6">
              <span>Secret Key</span>
              <input className="form-input" type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Enter admin key" />
            </label>
            {error && <p className="form-error mt-3">{error}</p>}
            <button className="btn-primary mt-6 w-full" type="submit" disabled={isOverviewLoading}>
              {isOverviewLoading ? "Checking..." : "Open Dashboard"}
            </button>
          </form>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="glass-panel h-fit p-4">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Admin CRM</p>
                <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Message Center</h1>
              </div>

              <div className="grid gap-2">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleTabChange(tab.key)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                        active
                          ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <Icon />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-2">
                <button className="btn-secondary flex-1" type="button" onClick={refreshCurrentView}>
                  Refresh <FiRefreshCw />
                </button>
                <button className="btn-secondary flex-1" type="button" onClick={handleLogout}>
                  Logout <FiX />
                </button>
              </div>
            </aside>

            <div className="space-y-6">
              {dashboardError && <div className="rounded-2xl bg-rose-500/10 p-4 font-semibold text-rose-700 dark:text-rose-300">{dashboardError}</div>}

              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">Overview</span>
                    <h2 className="page-title">Premium CRM snapshot</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {isOverviewLoading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <div className="glass-card animate-pulse p-5" key={index}>
                            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="mt-4 h-10 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                          </div>
                        ))
                      : statCards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <div className="glass-card p-5" key={card.label}>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-black text-slate-500 dark:text-slate-400">{card.label}</p>
                                  <strong className="mt-3 block text-3xl text-slate-950 dark:text-white">{card.value}</strong>
                                </div>
                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                                  <Icon />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>

                  <div className="glass-panel p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Latest Activity</span>
                        <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Recent messages</h3>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {recentMessages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200/80 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                          No recent messages yet.
                        </div>
                      ) : (
                        recentMessages.map((message) => (
                          <button
                            type="button"
                            key={message.id}
                            onClick={() => {
                              setDrawerMessage(message);
                              setActiveTab(message.source === "hire-me" ? "hire" : "contact");
                            }}
                            className="rounded-2xl border border-slate-200/70 bg-white/65 p-4 text-left transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="font-black text-slate-950 dark:text-white">{message.subject || message.projectType || "Message"}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.name} · {message.email}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone[message.status]}`}>{getStatusLabel(message.status)}</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-black ${sourceTone[message.source]}`}>{message.source}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === "contact" || activeTab === "hire" || activeTab === "archived") && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="section-heading">
                      <span className="eyebrow">{activeTab === "contact" ? "Contact Messages" : activeTab === "hire" ? "Hire Me Requests" : "Archived"}</span>
                      <h2 className="page-title">Search, triage, and follow up</h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary" type="button" disabled={isExporting} onClick={() => handleExport("contact")}>
                        Export Contact <FiDownload />
                      </button>
                      <button className="btn-secondary" type="button" disabled={isExporting} onClick={() => handleExport("hire")}>
                        Export Hire <FiDownload />
                      </button>
                      <button className="btn-primary" type="button" disabled={isExporting} onClick={() => handleExport("all")}>
                        Export All <FiDownload />
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel grid gap-4 p-5 xl:grid-cols-6">
                    <label className="form-label xl:col-span-2">
                      <span>Search</span>
                      <input className="form-input" value={filters.search} onChange={(event) => handleFilterChange("search", event.target.value)} placeholder="Name, email, subject, message" />
                    </label>
                    <label className="form-label">
                      <span>Status</span>
                      <select className="form-input" value={activeTab === "archived" ? "archived" : filters.status} disabled={activeTab === "archived"} onChange={(event) => handleFilterChange("status", event.target.value)}>
                        <option value="">All statuses</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{getStatusLabel(status)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="form-label">
                      <span>Source</span>
                      <select className="form-input" value={filters.source} onChange={(event) => handleFilterChange("source", event.target.value)} disabled={activeTab === "contact" || activeTab === "hire"}>
                        <option value="">All sources</option>
                        <option value="contact">Contact</option>
                        <option value="hire-me">Hire Me</option>
                      </select>
                    </label>
                    <label className="form-label">
                      <span>Sort</span>
                      <select className="form-input" value={filters.sort} onChange={(event) => handleFilterChange("sort", event.target.value)}>
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-end">
                      <button className="btn-secondary w-full" type="button" onClick={() => setFilters({ ...initialFilters, source: activeTab === "contact" ? "contact" : activeTab === "hire" ? "hire-me" : "" })}>
                        Reset <FiFilter />
                      </button>
                    </div>
                    <label className="form-label">
                      <span>Date From</span>
                      <input className="form-input" type="date" value={filters.dateFrom} onChange={(event) => handleFilterChange("dateFrom", event.target.value)} />
                    </label>
                    <label className="form-label">
                      <span>Date To</span>
                      <input className="form-input" type="date" value={filters.dateTo} onChange={(event) => handleFilterChange("dateTo", event.target.value)} />
                    </label>
                  </div>

                  <div className="glass-panel overflow-hidden p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200/70 dark:divide-white/10">
                        <thead className="bg-slate-50/80 dark:bg-white/5">
                          <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {["Name", "Subject", "Source", "Status", "Created", "Actions"].map((heading) => (
                              <th className="px-4 py-4" key={heading}>{heading}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
                          {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                              <tr key={index}>
                                <td className="px-4 py-4" colSpan={6}>
                                  <div className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
                                </td>
                              </tr>
                            ))
                          ) : messages.length === 0 ? (
                            <tr>
                              <td className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={6}>
                                No messages match the current filters.
                              </td>
                            </tr>
                          ) : (
                            messages.map((message) => (
                              <tr key={message.id} className="bg-white/65 dark:bg-transparent">
                                <td className="px-4 py-4 align-top">
                                  <div>
                                    <p className="font-black text-slate-950 dark:text-white">{message.name}</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.email}</p>
                                    {message.phone && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{message.phone}</p>}
                                  </div>
                                </td>
                                <td className="px-4 py-4 align-top">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">{message.subject || message.projectType || "Message"}</p>
                                  <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{message.message.slice(0, 120)}{message.message.length > 120 ? "..." : ""}</p>
                                </td>
                                <td className="px-4 py-4 align-top">
                                  <span className={`rounded-full px-3 py-1 text-xs font-black ${sourceTone[message.source]}`}>{message.source}</span>
                                </td>
                                <td className="px-4 py-4 align-top">
                                  <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone[message.status]}`}>{getStatusLabel(message.status)}</span>
                                </td>
                                <td className="px-4 py-4 align-top text-sm text-slate-500 dark:text-slate-400">
                                  {new Date(message.createdAt).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 align-top">
                                  <div className="flex flex-wrap gap-2">
                                    <button className="btn-secondary" type="button" onClick={() => setDrawerMessage(message)}>
                                      View <FiEye />
                                    </button>
                                    <button className="btn-secondary" type="button" disabled={actionId === message.id} onClick={() => handleStatusUpdate(message, message.status === "new" ? "read" : "new")}>
                                      {message.status === "new" ? "Mark Read" : "Mark Unread"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Page {pagination.page} of {pagination.totalPages} · {pagination.total} total messages
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-secondary" type="button" disabled={!pagination.hasPrevious} onClick={() => handleFilterChange("page", Math.max(filters.page - 1, 1))}>
                          <FiChevronLeft /> Previous
                        </button>
                        <button className="btn-secondary" type="button" disabled={!pagination.hasNext} onClick={() => handleFilterChange("page", filters.page + 1)}>
                          Next <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">Settings</span>
                    <h2 className="page-title">Environment and operations</h2>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {[
                      "Set ADMIN_KEY in Vercel for server-side request validation.",
                      "Keep VITE_ADMIN_KEY only for the frontend login prompt if you want a matching UI gate.",
                      "Set MONGODB_URI in Vercel. Messages stay in MongoDB after redeploy.",
                      "Optional email notification can be wired later without changing the CRM data model.",
                    ].map((item) => (
                      <div className="glass-panel p-5" key={item}>
                        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {drawerMessage && (
              <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" onClick={() => setDrawerMessage(null)}>
                <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-950" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{drawerMessage.source}</p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{drawerMessage.subject || drawerMessage.projectType || "Message"}</h3>
                    </div>
                    <button className="icon-btn" type="button" onClick={() => setDrawerMessage(null)} aria-label="Close details">
                      <FiX />
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone[drawerMessage.status]}`}>{getStatusLabel(drawerMessage.status)}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${sourceTone[drawerMessage.source]}`}>{drawerMessage.source}</span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <DetailField label="Name" value={drawerMessage.name} />
                    <DetailField label="Email" value={drawerMessage.email} />
                    <DetailField label="Phone" value={drawerMessage.phone || "Not provided"} />
                    <DetailField label="Created" value={new Date(drawerMessage.createdAt).toLocaleString()} />
                    <DetailField label="Updated" value={new Date(drawerMessage.updatedAt).toLocaleString()} />
                    <DetailField label="IP Address" value={drawerMessage.ipAddress || "Unavailable"} />
                    <DetailField label="User Agent" value={drawerMessage.userAgent || "Unavailable"} full />
                    {drawerMessage.company && <DetailField label="Company" value={drawerMessage.company} />}
                    {drawerMessage.projectType && <DetailField label="Project Type" value={drawerMessage.projectType} />}
                    {drawerMessage.budget && <DetailField label="Budget" value={drawerMessage.budget} />}
                    {drawerMessage.timeline && <DetailField label="Timeline" value={drawerMessage.timeline} />}
                  </div>

                  <div className="mt-6 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Message</p>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-200">{drawerMessage.message}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button className="btn-secondary" type="button" onClick={() => handleCopy(drawerMessage.email, "email")}>
                      Copy Email <FiCopy />
                    </button>
                    <button className="btn-secondary" type="button" onClick={() => handleCopy(`${drawerMessage.name}\n${drawerMessage.email}\n${drawerMessage.message}`, "message")}>
                      Copy Full Message <FiCopy />
                    </button>
                    {drawerMessage.status !== "read" && drawerMessage.status !== "archived" && (
                      <button className="btn-secondary" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "read")}>
                        Mark Read
                      </button>
                    )}
                    {drawerMessage.status !== "new" && drawerMessage.status !== "archived" && (
                      <button className="btn-secondary" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "new")}>
                        Mark Unread
                      </button>
                    )}
                    {drawerMessage.status !== "replied" && drawerMessage.status !== "archived" && (
                      <button className="btn-secondary" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "replied")}>
                        Mark Replied
                      </button>
                    )}
                    {drawerMessage.status !== "archived" ? (
                      <button className="btn-secondary" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "archived")}>
                        Archive
                      </button>
                    ) : (
                      <button className="btn-secondary" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "read")}>
                        Restore
                      </button>
                    )}
                    <button className="btn-secondary text-rose-600 dark:text-rose-300" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleDelete(drawerMessage)}>
                      Delete Permanently <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function DetailField({ label, value, full = false }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 ${full ? "md:col-span-2" : ""}`}>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}

export default Admin;
