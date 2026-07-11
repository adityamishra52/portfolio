import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { profile, seoKeywords, siteUrl } from "../data/portfolio";

const defaultDescription =
  "Aditaya Kumar Mishra portfolio, also searchable as Aditaya, Aditya, Aditaya Mishra, and adityamishra52. Full Stack MERN Developer building React, Vite, Node.js, MongoDB, AI web apps, SEO-ready websites, dashboards, and testing-focused products.";

const aliasText = profile.aliases.join(", ");

const ensureMeta = (selector, attribute, value) => {
  if (!value) return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const property = selector.match(/property="([^"]+)"/)?.[1];
    const name = selector.match(/name="([^"]+)"/)?.[1];
    if (property) element.setAttribute("property", property);
    if (name) element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

const ensureLink = (selector, rel, href) => {
  if (!href) return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const normalizePath = (path) => (path && path !== "/" ? path.replace(/\/$/, "") : "/");

const absoluteUrl = (value = "/") => {
  if (value.startsWith("http")) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${siteUrl}${normalized}`;
};

const routeLabel = (segment) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const buildBreadcrumb = (path) => {
  const normalizedPath = normalizePath(path);
  const segments = normalizedPath === "/" ? [] : normalizedPath.split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${siteUrl}/`,
    },
    ...segments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: routeLabel(segment),
      item: `${siteUrl}/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(normalizedPath)}#breadcrumb`,
    itemListElement: items,
  };
};

const schemaTypeForPath = (path) => {
  if (path === "/about") return "AboutPage";
  if (path === "/contact") return "ContactPage";
  return "WebPage";
};

function SEO({
  title,
  description = defaultDescription,
  keywords,
  canonical,
  path,
  image = "/og-image.png",
  imageAlt = "Aditaya Kumar Mishra full stack developer portfolio preview",
  jsonLd,
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  type = "website",
}) {
  const location = useLocation();
  const currentPath = normalizePath(path || location.pathname || "/");
  const fullTitle = title ? `${title} | ${profile.name}` : `${profile.name} | Full Stack Developer`;
  const url = canonical || absoluteUrl(currentPath);
  const imageUrl = absoluteUrl(image);
  const keywordText = useMemo(() => {
    const values = Array.isArray(keywords) ? [...seoKeywords, ...keywords] : seoKeywords;
    return [...new Set(values)].join(", ");
  }, [keywords]);

  const routeSchema = useMemo(() => {
    const extraGraph = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": schemaTypeForPath(currentPath),
          "@id": `${url}#webpage`,
          url,
          name: fullTitle,
          headline: fullTitle,
          alternateName: [
            `${profile.name} Portfolio`,
            "Aditaya Portfolio",
            "Aditya Portfolio",
            "Aditaya Mishra Portfolio",
            "adityamishra52 portfolio",
          ],
          description,
          isPartOf: { "@id": `${siteUrl}/#website` },
          about: { "@id": `${siteUrl}/#person` },
          author: { "@id": `${siteUrl}/#person` },
          creator: { "@id": `${siteUrl}/#person` },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: imageUrl,
          },
          breadcrumb: { "@id": `${url}#breadcrumb` },
          keywords: keywordText,
          inLanguage: "en-IN",
        },
        buildBreadcrumb(currentPath),
        ...extraGraph,
      ],
    };
  }, [currentPath, description, fullTitle, imageUrl, jsonLd, keywordText, url]);

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = "en";

    ensureMeta('meta[name="description"]', "content", description);
    ensureMeta('meta[name="keywords"]', "content", keywordText);
    ensureMeta('meta[name="author"]', "content", profile.name);
    ensureMeta('meta[name="creator"]', "content", profile.name);
    ensureMeta('meta[name="publisher"]', "content", profile.name);
    ensureMeta('meta[name="owner"]', "content", profile.name);
    ensureMeta('meta[name="designer"]', "content", profile.name);
    ensureMeta('meta[name="developer"]', "content", profile.name);
    ensureMeta('meta[name="contact"]', "content", profile.email);
    ensureMeta('meta[name="profile:first_name"]', "content", "Aditaya");
    ensureMeta('meta[name="profile:last_name"]', "content", "Mishra");
    ensureMeta('meta[name="alternate-name"]', "content", aliasText);
    ensureMeta('meta[name="subject"]', "content", `${profile.name} Full Stack Developer Portfolio`);
    ensureMeta('meta[name="classification"]', "content", "Portfolio, Full Stack Developer, MERN Developer, React Developer, SEO, Website Testing");
    ensureMeta('meta[name="robots"]', "content", robots);
    ensureMeta('meta[name="googlebot"]', "content", robots);
    ensureMeta('meta[name="bingbot"]', "content", robots);
    ensureMeta('meta[name="language"]', "content", "English");
    ensureMeta('meta[name="distribution"]', "content", "global");
    ensureMeta('meta[name="rating"]', "content", "general");
    ensureMeta('meta[name="referrer"]', "content", "strict-origin-when-cross-origin");
    ensureMeta('meta[name="application-name"]', "content", "Aditaya Kumar Mishra Portfolio");

    ensureMeta('meta[property="og:type"]', "content", type);
    ensureMeta('meta[property="og:locale"]', "content", "en_IN");
    ensureMeta('meta[property="og:site_name"]', "content", "Aditaya Kumar Mishra Portfolio");
    ensureMeta('meta[property="og:title"]', "content", fullTitle);
    ensureMeta('meta[property="og:description"]', "content", description);
    ensureMeta('meta[property="og:url"]', "content", url);
    ensureMeta('meta[property="og:image"]', "content", imageUrl);
    ensureMeta('meta[property="og:image:secure_url"]', "content", imageUrl);
    ensureMeta('meta[property="og:image:type"]', "content", "image/png");
    ensureMeta('meta[property="og:image:width"]', "content", "1200");
    ensureMeta('meta[property="og:image:height"]', "content", "630");
    ensureMeta('meta[property="og:image:alt"]', "content", imageAlt);
    ensureMeta('meta[property="article:author"]', "content", profile.linkedin);
    ensureMeta('meta[property="profile:first_name"]', "content", "Aditaya");
    ensureMeta('meta[property="profile:last_name"]', "content", "Mishra");
    ensureMeta('meta[property="profile:username"]', "content", "adityamishra52");

    ensureMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    ensureMeta('meta[name="twitter:title"]', "content", fullTitle);
    ensureMeta('meta[name="twitter:description"]', "content", description);
    ensureMeta('meta[name="twitter:image"]', "content", imageUrl);
    ensureMeta('meta[name="twitter:image:alt"]', "content", imageAlt);
    ensureMeta('meta[name="twitter:creator"]', "content", "@adityamishra52");
    ensureMeta('meta[name="twitter:site"]', "content", "@adityamishra52");

    ensureLink('link[rel="canonical"]', "canonical", url);

    const oldJson = document.getElementById("route-json-ld");
    oldJson?.remove();
    const script = document.createElement("script");
    script.id = "route-json-ld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(routeSchema);
    document.head.appendChild(script);

    return () => {
      document.getElementById("route-json-ld")?.remove();
    };
  }, [description, fullTitle, imageAlt, imageUrl, keywordText, robots, routeSchema, type, url]);

  return null;
}

export default SEO;
