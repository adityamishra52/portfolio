const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim();

let initialized = false;

const injectScript = (src, attrs = {}) => {
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  Object.entries(attrs).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  document.head.appendChild(script);
};

export const initAnalytics = () => {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  if (GA_ID) {
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }

  if (CLARITY_ID && !window.clarity) {
    ((c, l, a, r, i, t, y) => {
      c[a] =
        c[a] ||
        function clarity(...args) {
          (c[a].q = c[a].q || []).push(args);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (typeof window.clarity === "function") {
    window.clarity("event", eventName);
  }
};

export const trackPageView = (path) => {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};
