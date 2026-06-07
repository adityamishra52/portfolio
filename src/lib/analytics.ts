import ReactGA from "react-ga4";

const measurementId: string = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
const isProduction: boolean = import.meta.env.PROD;

let gaInitialized = false;

const mongoEligibleCategories: ReadonlySet<string> = new Set(["Resume", "Projects", "Social"]);
const categoryMap: Record<string, string> = {
  Resume: "resume",
  Projects: "project",
  Social: "social",
};

const recordBusinessEvent = (category: string, action: string, label?: string): void => {
  if (typeof window === "undefined" || !mongoEligibleCategories.has(category)) {
    return;
  }

  const payload = {
    category: categoryMap[category],
    action,
    label: label ?? "",
    path: `${window.location.pathname}${window.location.search}`,
    metadata: {
      title: document.title,
    },
  };

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Cookie-free fallback: analytics failures should never break the site experience.
  });
};

/**
 * Analytics starts here.
 * This only initializes Google Analytics in production and safely no-ops if GA is unavailable.
 */
export const initAnalytics = (): void => {
  if (!isProduction || gaInitialized || !measurementId) {
    return;
  }

  try {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        anonymize_ip: true,
      },
    });
    gaInitialized = true;
  } catch (error) {
    console.warn("[analytics] Google Analytics failed to initialize.", error);
  }
};

export const trackPageView = (path: string): void => {
  if (!isProduction || !gaInitialized || !path) {
    return;
  }

  try {
    ReactGA.send({
      hitType: "pageview",
      page: path,
      title: document.title,
    });
  } catch (error) {
    console.warn("[analytics] Page view tracking failed.", error);
  }
};

/**
 * Reusable event helper for portfolio interactions.
 * Use this from UI click and form handlers so event names stay consistent.
 */
export const trackEvent = (category: string, action: string, label?: string): void => {
  if (!category || !action) {
    return;
  }

  recordBusinessEvent(category, action, label);

  if (!isProduction || !gaInitialized) {
    return;
  }

  try {
    ReactGA.event({
      category,
      action,
      label,
    });
  } catch (error) {
    console.warn("[analytics] Event tracking failed.", error);
  }
};
