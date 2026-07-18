import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiArchive,
  FiBarChart2,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCopy,
  FiDownload,
  FiEye,
  FiFileText,
  FiFilter,
  FiGithub,
  FiGlobe,
  FiInbox,
  FiLayers,
  FiLinkedin,
  FiLock,
  FiMail,
  FiMoon,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiSun,
  FiTrash2,
  FiTrendingUp,
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
  getAdminProfileImage,
  getAdminSession,
  loginAdmin,
  resetAdminProfileImage,
  saveAdminSession,
  updateAdminMessage,
  updateAdminProfileImage,
} from "../utils/storage";

const tabs = [
  { key: "overview", label: "Overview", icon: FiBarChart2 },
  { key: "contact", label: "Contact Messages", icon: FiMail },
  { key: "hire", label: "Hire Requests", icon: FiUsers },
  { key: "leads", label: "Leads Dashboard", icon: FiTrendingUp },
  { key: "analytics", label: "Analytics", icon: FiActivity },
  { key: "seo", label: "SEO Status", icon: FiGlobe },
  { key: "settings", label: "Settings", icon: FiSettings },
];

const statusOptions = ["new", "read", "replied", "archived"];
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
  if (filters.source && tab !== "contact" && tab !== "hire") query.type = filters.source === "hire-me" ? "hire" : "contact";
  if (!query.type) query.type = "all";
  if (filters.status) query.status = filters.status;

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
  const session = getAdminSession();
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState(() => session?.token || "");
  const [authenticated, setAuthenticated] = useState(() => Boolean(session?.token));
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("theme") || "dark";
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNext: false, hasPrevious: false });
  const [filters, setFilters] = useState(initialFilters);
  const [drawerMessage, setDrawerMessage] = useState(null);
  const [error, setError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [actionId, setActionId] = useState("");

  const currentQuery = useMemo(() => buildQueryForTab(activeTab, filters), [activeTab, filters]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: theme }));
  }, [theme]);

  const loadOverview = async (currentToken) => {
    setIsOverviewLoading(true);
    setDashboardError("");

    try {
      const result = await getAdminOverview(currentToken);
      setOverview(result.overview);
    } catch (loadError) {
      setDashboardError(loadError.message || "Could not load dashboard overview.");
      if (loadError.status === 401) {
        clearAdminSession();
        setAuthenticated(false);
        setToken("");
      }
    } finally {
      setIsOverviewLoading(false);
    }
  };

  const loadMessages = async (currentToken) => {
    if (!["contact", "hire"].includes(activeTab)) return;

    setIsLoadingMessages(true);
    setDashboardError("");

    try {
      const result = await getAdminMessages(currentToken, currentQuery);
      setMessages(result.entries);
      setPagination(result.pagination);
    } catch (loadError) {
      setDashboardError(loadError.message || "Could not load messages.");
      if (loadError.status === 401) {
        clearAdminSession();
        setAuthenticated(false);
        setToken("");
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!authenticated || !token) return;
    loadOverview(token);
  }, [authenticated, token]);

  useEffect(() => {
    if (!authenticated || !token) return;
    loadMessages(token);
  }, [authenticated, token, activeTab, currentQuery]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!secret.trim()) {
      setError("Enter your admin secret.");
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await loginAdmin(secret.trim());
      setToken(result.token);
      setAuthenticated(true);
      saveAdminSession({ token: result.token, authenticated: true, expiresIn: result.expiresIn });
      setSecret("");
    } catch (loginError) {
      setError(loginError.message || "Could not sign in.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setToken("");
    setAuthenticated(false);
    setOverview(null);
    setMessages([]);
    setDrawerMessage(null);
    setFilters(initialFilters);
  };

  const handleThemeToggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 1,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setDrawerMessage(null);
    setFilters((current) => ({
      ...initialFilters,
      source: tab === "contact" ? "contact" : tab === "hire" ? "hire-me" : current.source,
    }));
  };

  const handleStatusUpdate = async (message, status) => {
    setActionId(message.id);
    setDashboardError("");

    try {
      const result = await updateAdminMessage(token, message.id, {
        type: message.source === "hire-me" ? "hire" : "contact",
        status,
      });
      setMessages((current) => current.map((item) => (item.id === result.entry.id ? result.entry : item)));
      setDrawerMessage((current) => (current?.id === result.entry.id ? result.entry : current));
      await loadOverview(token);
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
      await deleteAdminMessage(token, message.id, message.source === "hire-me" ? "hire" : "contact");
      setMessages((current) => current.filter((item) => item.id !== message.id));
      setDrawerMessage((current) => (current?.id === message.id ? null : current));
      await loadOverview(token);
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

  const handleExport = async (format) => {
    setIsExporting(true);
    setDashboardError("");

    try {
      const type = activeTab === "contact" ? "contact" : activeTab === "hire" ? "hire" : "all";
      const blob = await exportAdminMessages(token, currentQuery, format);
      const extension = format === "excel" ? "xls" : "csv";
      triggerDownload(blob, `${type}-messages.${extension}`);
    } catch (exportError) {
      setDashboardError(exportError.message || "Could not export data.");
    } finally {
      setIsExporting(false);
    }
  };

  const kpiCards = overview
    ? [
        { label: "Total Visitors", value: overview.kpis.totalVisitors, helper: overview.analyticsStatus.gaConnected ? "View full traffic in GA4" : "GA4 not configured", icon: FiUsers },
        { label: "Active Users", value: overview.kpis.activeUsers, helper: overview.analyticsStatus.gaConnected ? "Realtime in GA4" : "GA4 not configured", icon: FiActivity },
        { label: "Page Views", value: overview.kpis.pageViews, helper: overview.analyticsStatus.gaConnected ? "Tracked in GA4" : "GA4 not configured", icon: FiFileText },
        { label: "Resume Downloads", value: overview.kpis.resumeDownloads, helper: "Stored in MongoDB", icon: FiDownload },
        { label: "Hire Requests", value: overview.kpis.hireRequests, helper: "Business leads", icon: FiBriefcaseLike },
        { label: "Contact Messages", value: overview.kpis.contactMessages, helper: "Inbox count", icon: FiMail },
        { label: "Project Clicks", value: overview.kpis.projectClicks, helper: "Tracked lead interactions", icon: FiLayers },
        { label: "WhatsApp Clicks", value: overview.kpis.whatsappClicks, helper: "High-intent social actions", icon: FiLinkedinLike },
      ]
    : [];

  return (
    <>
      <SEO title="Admin" path="/admin-aditaya" description="Private admin dashboard." robots="noindex, nofollow" />
      <section className="page-section">
        {!authenticated ? (
          <form className="glass-panel mx-auto max-w-lg p-6 md:p-8" onSubmit={handleLogin}>
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl text-teal-700 dark:text-teal-300">
              <FiLock />
            </div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">Admin Analytics Login</h1>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Sign in with the admin secret to open the JWT-protected CRM, leads dashboard, and analytics status center.
            </p>
            <label className="form-label mt-6">
              <span>Admin Secret</span>
              <input className="form-input" type="password" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="Enter admin secret" />
            </label>
            {error && <p className="form-error mt-3">{error}</p>}
            <button className="btn-primary mt-6 w-full" type="submit" disabled={isAuthenticating}>
              {isAuthenticating ? "Signing in..." : "Open Dashboard"}
            </button>
          </form>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="glass-panel h-fit self-start p-4 xl:sticky xl:top-24">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Production Admin</p>
                <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Lead Management</h1>
              </div>

              <div className="-mx-1 overflow-x-auto pb-1 xl:mx-0 xl:overflow-visible">
                <div className="flex min-w-max gap-2 xl:grid xl:min-w-0">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleTabChange(tab.key)}
                        className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition xl:w-full ${
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
              </div>

              <div className="mt-6 space-y-3">
                <button className="btn-secondary w-full justify-between" type="button" onClick={handleThemeToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                  <span className="rounded-full bg-slate-950/5 px-2 py-1 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-white/10 dark:text-slate-300">
                    {theme}
                  </span>
                </button>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <button className="btn-secondary w-full" type="button" onClick={() => loadOverview(token)}>
                  Refresh <FiRefreshCw />
                </button>
                <button className="btn-secondary w-full" type="button" onClick={handleLogout}>
                  Logout <FiX />
                </button>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              {dashboardError && <div className="rounded-2xl bg-rose-500/10 p-4 font-semibold text-rose-700 dark:text-rose-300">{dashboardError}</div>}

              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">Overview</span>
                    <h2 className="page-title">Production-ready analytics and lead snapshot</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    {isOverviewLoading
                      ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="glass-card h-36 animate-pulse p-5" />)
                      : kpiCards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <div className="glass-card p-5" key={card.label}>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-black text-slate-500 dark:text-slate-400">{card.label}</p>
                                  <strong className="mt-3 block text-3xl text-slate-950 dark:text-white">{card.value}</strong>
                                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.helper}</p>
                                </div>
                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                                  <Icon />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              )}

              {(activeTab === "contact" || activeTab === "hire") && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
                    <div className="section-heading">
                      <span className="eyebrow">{activeTab === "contact" ? "Contact Messages" : "Hire Requests"}</span>
                      <h2 className="page-title">Search, triage, and respond</h2>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      <button className="btn-secondary w-full" type="button" disabled={isExporting} onClick={() => handleExport("csv")}>
                        Export CSV <FiDownload />
                      </button>
                      <button className="btn-primary w-full" type="button" disabled={isExporting} onClick={() => handleExport("excel")}>
                        Export Excel <FiDownload />
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-6">
                    <label className="form-label md:col-span-2">
                      <span>Search</span>
                      <input className="form-input" value={filters.search} onChange={(event) => handleFilterChange("search", event.target.value)} placeholder="Name, email, subject, message" />
                    </label>
                    <label className="form-label">
                      <span>Status</span>
                      <select className="form-input" value={filters.status} onChange={(event) => handleFilterChange("status", event.target.value)}>
                        <option value="">All statuses</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{getStatusLabel(status)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="form-label">
                      <span>Sort</span>
                      <select className="form-input" value={filters.sort} onChange={(event) => handleFilterChange("sort", event.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </label>
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
                    <div className="grid gap-4 p-4 md:hidden">
                      {isLoadingMessages
                        ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-3xl bg-slate-100 dark:bg-white/5" />)
                        : messages.map((message) => (
                            <article className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5" key={message.id}>
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="font-black text-slate-950 dark:text-white">{message.name}</p>
                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.email}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone[message.status]}`}>{getStatusLabel(message.status)}</span>
                              </div>
                              <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{message.subject || message.projectType}</p>
                              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message.message.slice(0, 120)}...</p>
                              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                <button className="btn-secondary w-full" type="button" onClick={() => setDrawerMessage(message)}>View <FiEye /></button>
                                <button className="btn-secondary w-full" type="button" disabled={actionId === message.id} onClick={() => handleStatusUpdate(message, message.status === "new" ? "read" : "new")}>
                                  {message.status === "new" ? "Mark Read" : "Mark Unread"}
                                </button>
                              </div>
                            </article>
                          ))}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                      <table className="min-w-full divide-y divide-slate-200/70 dark:divide-white/10">
                        <thead className="bg-slate-50/80 dark:bg-white/5">
                          <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {["Name", "Details", "Status", "Date", "Actions"].map((heading) => (
                              <th className="px-4 py-4" key={heading}>{heading}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
                          {isLoadingMessages ? (
                            Array.from({ length: 5 }).map((_, index) => (
                              <tr key={index}>
                                <td className="px-4 py-4" colSpan={5}>
                                  <div className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
                                </td>
                              </tr>
                            ))
                          ) : messages.length === 0 ? (
                            <tr>
                              <td className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={5}>
                                No messages match the current filters.
                              </td>
                            </tr>
                          ) : (
                            messages.map((message) => (
                              <tr key={message.id} className="bg-white/65 dark:bg-transparent">
                                <td className="px-4 py-4 align-top">
                                  <p className="font-black text-slate-950 dark:text-white">{message.name}</p>
                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.email}</p>
                                  {message.phone && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{message.phone}</p>}
                                </td>
                                <td className="px-4 py-4 align-top">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">{message.subject || message.projectType}</p>
                                  {message.company && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{message.company}</p>}
                                  <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message.message.slice(0, 120)}{message.message.length > 120 ? "..." : ""}</p>
                                </td>
                                <td className="px-4 py-4 align-top">
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone[message.status]}`}>{getStatusLabel(message.status)}</span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-black ${sourceTone[message.source]}`}>{message.source}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 align-top text-sm text-slate-500 dark:text-slate-400">{new Date(message.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-4 align-top">
                                  <div className="flex flex-wrap gap-2">
                                    <button className="btn-secondary" type="button" onClick={() => setDrawerMessage(message)}>View <FiEye /></button>
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
                      <p className="text-sm text-slate-500 dark:text-slate-400">Page {pagination.page} of {pagination.totalPages} - {pagination.total} total messages</p>
                      <div className="grid gap-2 sm:flex">
                        <button className="btn-secondary w-full sm:w-auto" type="button" disabled={!pagination.hasPrevious} onClick={() => handleFilterChange("page", Math.max(filters.page - 1, 1))}>
                          <FiChevronLeft /> Previous
                        </button>
                        <button className="btn-secondary w-full sm:w-auto" type="button" disabled={!pagination.hasNext} onClick={() => handleFilterChange("page", filters.page + 1)}>
                          Next <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "leads" && overview && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">Leads Dashboard</span>
                    <h2 className="page-title">Daily, weekly, and monthly lead flow</h2>
                  </div>
                  <LeadChart title="Daily Leads" rows={overview.leads.daily} />
                  <LeadChart title="Weekly Leads" rows={overview.leads.weekly} />
                  <LeadChart title="Monthly Leads" rows={overview.leads.monthly} />
                  <ComparisonCards items={overview.leads.comparison} />
                </div>
              )}

              {activeTab === "analytics" && overview && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">Analytics</span>
                    <h2 className="page-title">Visitor analytics stay in GA4 and Clarity</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {[
                      { label: "Google Analytics", value: overview.analyticsStatus.gaConnected ? "Connected" : "Not connected", helper: "Page views, active users, traffic sources, countries, devices, browsers, top pages." },
                      { label: "Microsoft Clarity", value: overview.analyticsStatus.clarityConnected ? "Connected" : "Not connected", helper: "Session recordings, heatmaps, click maps, scroll depth." },
                      { label: "MongoDB Lead Storage", value: "Connected", helper: "Resume, project, social, contact, and hire lead data only." },
                    ].map((item) => (
                      <div className="glass-card p-5" key={item.label}>
                        <p className="text-sm font-black text-slate-500 dark:text-slate-400">{item.label}</p>
                        <strong className="mt-3 block text-2xl text-slate-950 dark:text-white">{item.value}</strong>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.helper}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    {[
                      { label: "Resume Downloads", value: overview.events.resumeDownloads, icon: FiDownload },
                      { label: "Project Clicks", value: overview.events.projectClicks, icon: FiLayers },
                      { label: "GitHub Clicks", value: overview.events.githubClicks, icon: FiGithub },
                      { label: "LinkedIn Clicks", value: overview.events.linkedinClicks, icon: FiLinkedin },
                    ].map((item) => (
                      <div className="glass-card p-5" key={item.label}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-black text-slate-500 dark:text-slate-400">{item.label}</p>
                            <strong className="mt-3 block text-3xl text-slate-950 dark:text-white">{item.value}</strong>
                          </div>
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                            <item.icon />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "seo" && overview && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">SEO Dashboard</span>
                    <h2 className="page-title">Deployment and discoverability health</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <StatusCard label="Google Analytics Connected" value={overview.analyticsStatus.gaConnected} />
                    <StatusCard label="Microsoft Clarity Connected" value={overview.analyticsStatus.clarityConnected} />
                    <StatusCard label="Sitemap Status" value={overview.analyticsStatus.sitemapStatus} />
                    <StatusCard label="Robots.txt Status" value={overview.analyticsStatus.robotsStatus} />
                    <StatusCard label="llms.txt Status" value={overview.analyticsStatus.llmsStatus} />
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="section-heading">
                    <span className="eyebrow">Settings</span>
                    <h2 className="page-title">Environment and deployment notes</h2>
                  </div>
                  <ProfileImageManager token={token} />
                  <div className="grid gap-4 lg:grid-cols-2">
                    {[
                      "Use JWT_SECRET to sign admin sessions. ADMIN_KEY can be set separately for the admin secret.",
                      "Google Analytics and Clarity stay client-side for traffic intelligence. MongoDB stores only business and lead data.",
                      "Primary MongoDB collections: contact_messages, hire_requests, resume_events, project_events, social_events, admin_users.",
                      "CSV and Excel exports are available for the message inbox.",
                    ].map((item) => (
                      <div className="glass-panel p-5" key={item}>
                        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {drawerMessage && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" onClick={() => setDrawerMessage(null)}>
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white p-4 shadow-2xl dark:bg-slate-950 sm:p-6" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{drawerMessage.source}</p>
                  <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">{drawerMessage.subject || drawerMessage.projectType || "Message"}</h3>
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

              <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap">
                <button className="btn-secondary w-full sm:w-auto" type="button" onClick={() => handleCopy(drawerMessage.email, "email")}>
                  Copy Email <FiCopy />
                </button>
                <button className="btn-secondary w-full sm:w-auto" type="button" onClick={() => handleCopy(`${drawerMessage.name}\n${drawerMessage.email}\n${drawerMessage.message}`, "message")}>
                  Copy Full Message <FiCopy />
                </button>
                {drawerMessage.status !== "read" && (
                  <button className="btn-secondary w-full sm:w-auto" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "read")}>
                    Mark Read
                  </button>
                )}
                {drawerMessage.status !== "new" && (
                  <button className="btn-secondary w-full sm:w-auto" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "new")}>
                    Mark Unread
                  </button>
                )}
                {drawerMessage.status !== "replied" && (
                  <button className="btn-secondary w-full sm:w-auto" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "replied")}>
                    Mark Replied
                  </button>
                )}
                {drawerMessage.status !== "archived" && (
                  <button className="btn-secondary w-full sm:w-auto" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleStatusUpdate(drawerMessage, "archived")}>
                    Archive
                  </button>
                )}
                <button className="btn-secondary w-full text-rose-600 dark:text-rose-300 sm:w-auto" type="button" disabled={actionId === drawerMessage.id} onClick={() => handleDelete(drawerMessage)}>
                  Delete <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

const MAX_PROFILE_IMAGE_DIMENSION = 800;

const resizeImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error("That file doesn't look like a valid image."));
      image.onload = () => {
        const scale = Math.min(1, MAX_PROFILE_IMAGE_DIMENSION / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

function ProfileImageManager({ token }) {
  const [status, setStatus] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cacheBust, setCacheBust] = useState(() => Date.now());

  const loadStatus = async () => {
    try {
      const result = await getAdminProfileImage(token);
      setStatus(result);
    } catch (loadError) {
      setError(loadError.message || "Could not load profile photo status.");
    }
  };

  useEffect(() => {
    if (token) loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    try {
      const dataUrl = await resizeImageFile(file);
      setPreview(dataUrl);
    } catch (resizeError) {
      setError(resizeError.message || "Could not process that image.");
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await updateAdminProfileImage(token, preview);
      setMessage("Profile photo updated. It's now live on Home and About.");
      setPreview("");
      setCacheBust(Date.now());
      await loadStatus();
    } catch (saveError) {
      setError(saveError.message || "Could not update profile photo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    setError("");
    setMessage("");

    try {
      await resetAdminProfileImage(token);
      setMessage("Reverted to the default profile photo.");
      setPreview("");
      setCacheBust(Date.now());
      await loadStatus();
    } catch (resetError) {
      setError(resetError.message || "Could not reset profile photo.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <img
          src={preview || `/api/profile-image?v=${cacheBust}`}
          alt="Current profile"
          className="h-28 w-28 shrink-0 rounded-2xl border border-slate-200/70 object-cover shadow-card dark:border-white/10"
        />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white">Profile Photo</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {status?.hasCustomImage
                ? `Custom photo live since ${new Date(status.updatedAt).toLocaleString()}.`
                : "Using the default portfolio photo."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              Choose New Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            <button className="btn-primary" type="button" disabled={!preview || isSaving} onClick={handleSave}>
              {isSaving ? "Saving..." : "Save Photo"}
            </button>
            {status?.hasCustomImage && (
              <button
                className="btn-secondary text-rose-600 dark:text-rose-300"
                type="button"
                disabled={isResetting}
                onClick={handleReset}
              >
                {isResetting ? "Resetting..." : "Reset to Default"}
              </button>
            )}
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="text-sm font-bold text-emerald-600 dark:text-emerald-300">{message}</p>}
          <p className="text-xs text-slate-400 dark:text-slate-500">JPEG, PNG, or WebP. Automatically resized before upload.</p>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value }) {
  return (
    <div className="glass-card p-5">
      <p className="text-sm font-black text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${value ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>
          {value ? "Available" : "Missing"}
        </span>
      </div>
    </div>
  );
}

function LeadChart({ title, rows }) {
  const maxValue = Math.max(...rows.map((row) => row.total), 1);

  return (
    <div className="glass-panel p-6">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-5 grid gap-4">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No lead data yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{row.label}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{row.total} total</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(row.total / maxValue) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Contact: {row.contact}</span>
                <span>Hire: {row.hire}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ComparisonCards({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div className="glass-card p-5" key={item.label}>
          <p className="text-sm font-black text-slate-500 dark:text-slate-400">{item.label}</p>
          <strong className="mt-3 block text-3xl text-slate-950 dark:text-white">{item.value}</strong>
        </div>
      ))}
    </div>
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

function FiBriefcaseLike() {
  return <FiUserCheck />;
}

function FiLinkedinLike() {
  return <FiInbox />;
}

export default Admin;
