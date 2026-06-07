const fs = require("fs");
const path = require("path");
const { getOverviewStats } = require("./messages");
const { getEventOverview } = require("./leadEvents");

const publicFileStatus = (fileName) => {
  const target = path.join(process.cwd(), "public", fileName);
  return fs.existsSync(target);
};

const getBucketLabel = (date, mode) => {
  const current = new Date(date);

  if (mode === "daily") {
    return current.toISOString().slice(0, 10);
  }

  if (mode === "weekly") {
    const start = new Date(current);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start.toISOString().slice(0, 10);
  }

  return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
};

const buildSeries = (messages, mode) => {
  const counts = messages.reduce((accumulator, message) => {
    const key = getBucketLabel(message.createdAt, mode);
    const current = accumulator[key] || { label: key, contact: 0, hire: 0, total: 0 };
    if (message.source === "contact") current.contact += 1;
    if (message.source === "hire-me") current.hire += 1;
    current.total += 1;
    accumulator[key] = current;
    return accumulator;
  }, {});

  return Object.values(counts).sort((left, right) => left.label.localeCompare(right.label));
};

const getAdminOverviewPayload = async () => {
  const messageOverview = await getOverviewStats();
  const eventOverview = await getEventOverview();
  const allMessages = messageOverview.allMessages || [];

  return {
    kpis: {
      totalVisitors: "GA4",
      activeUsers: "GA4",
      pageViews: "GA4",
      resumeDownloads: eventOverview.resumeDownloads,
      hireRequests: messageOverview.totalHireRequests,
      contactMessages: messageOverview.totalContactMessages,
      projectClicks: eventOverview.projectClicks,
      whatsappClicks: eventOverview.whatsappClicks,
    },
    messages: messageOverview,
    events: eventOverview,
    leads: {
      daily: buildSeries(allMessages, "daily").slice(-14),
      weekly: buildSeries(allMessages, "weekly").slice(-12),
      monthly: buildSeries(allMessages, "monthly").slice(-12),
      comparison: [
        { label: "Contact", value: messageOverview.totalContactMessages },
        { label: "Hire Me", value: messageOverview.totalHireRequests },
      ],
    },
    analyticsStatus: {
      gaConnected: Boolean(process.env.VITE_GA_MEASUREMENT_ID),
      clarityConnected: Boolean(process.env.VITE_CLARITY_PROJECT_ID),
      sitemapStatus: publicFileStatus("sitemap.xml"),
      robotsStatus: publicFileStatus("robots.txt"),
      llmsStatus: publicFileStatus("llms.txt"),
    },
  };
};

module.exports = {
  getAdminOverviewPayload,
};
