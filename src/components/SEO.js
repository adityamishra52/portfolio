import { useEffect } from "react";
import { siteUrl, profile, seoKeywords } from "../data/portfolio";

const setMeta = (selector, attr, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    if (selector.includes("property=")) {
      element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
    } else {
      element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
};

function SEO({ title, description, path = "/", image = "/Aditaya.png", jsonLd, robots = "index, follow, max-image-preview:large" }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${profile.name}` : `${profile.name} | Full Stack MERN Developer`;
    const url = `${siteUrl}${path}`;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="keywords"]', "content", seoKeywords.join(", "));
    setMeta('meta[name="author"]', "content", profile.name);
    setMeta('meta[name="robots"]', "content", robots);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", imageUrl);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    const oldJson = document.getElementById("route-json-ld");
    oldJson?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "route-json-ld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, jsonLd, robots]);

  return null;
}

export default SEO;
