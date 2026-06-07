import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackEvent, trackPageView } from "../utils/analytics";

function AnalyticsProvider() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClick = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      if (href.includes("Aditaya_Mishra_Resume.pdf")) {
        trackEvent("resume_download", { href });
      }

      if (href.startsWith("http")) {
        trackEvent("external_link_click", { href });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

export default AnalyticsProvider;
