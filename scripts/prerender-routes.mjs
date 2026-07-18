// Generates a static index.html per route inside dist/ so crawlers get the
// correct <title>, description, canonical, OG/Twitter tags, and JSON-LD in the
// raw HTML response instead of relying on client-side JS to patch them in.
// This is what fixes the GSC "Alternate page with proper canonical tag" issue:
// previously every route served the same shell whose static canonical always
// pointed at "/", so Google treated sub-pages as duplicates of the homepage.
//
// Metadata below mirrors the <SEO ...> props used in src/pages/*.js and the
// arrays in src/data/portfolio.js / src/data/projects.js. Keep them in sync
// if the page copy changes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const siteUrl = "https://aditaya-portfolio.vercel.app";
const authorName = "Aditaya Kumar Mishra";

const baseKeywords = [
  "Aditaya",
  "Aditya",
  "Aditaya Kumar Mishra",
  "Aditya Kumar Mishra",
  "Aditaya Mishra",
  "Aditya Mishra",
  "Aditaya Portfolio",
  "Aditya Portfolio",
  "Aditaya Kumar Mishra Portfolio",
  "Aditya Kumar Mishra Portfolio",
  "Aditaya Developer Portfolio",
  "Aditaya Full Stack Developer",
  "Aditaya MERN Developer",
  "Aditaya React Developer",
  "Aditaya Web Developer",
  "adityamishra52",
  "adityamishra52 portfolio",
  "adityamishra5214352",
  "Aditaya Bangalore Developer",
  "Aditaya Kumar Mishra Bangalore",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "MongoDB Developer",
  "JavaScript Developer",
  "Frontend Developer",
  "Backend Developer",
  "Web Developer India",
  "SEO Expert",
  "Website Tester",
  "Portfolio Developer",
  "AI Web Developer",
  "Machine Learning Developer",
  "Data Analyst",
  "Python Developer",
  "Vite Developer",
  "Tailwind CSS Developer",
];

const alternateNames = [
  `${authorName} Portfolio`,
  "Aditaya Portfolio",
  "Aditya Portfolio",
  "Aditaya Mishra Portfolio",
  "adityamishra52 portfolio",
];

const projectMeta = [
  {
    slug: "boostpilot-ai",
    title: "BoostPilot AI",
    category: "AI Creator Platform",
    description:
      "AI-powered content optimization platform for creators. It analyzes images and videos, then generates captions, hooks, hashtags, platform suggestions, thumbnail ideas, and export-ready insight reports.",
    tech: ["React", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "GridFS", "JWT", "AI API", "Vercel", "Render"],
    image: "/projects/boostpilot-ai-dashboard.png",
    imageAlt: "BoostPilot AI content analysis dashboard",
  },
  {
    slug: "optiresume",
    title: "OptiResume",
    category: "AI Resume Builder",
    description:
      "OptiResume is an AI-powered resume builder and resume optimization platform that helps users create professional resumes, upload existing resumes, edit content, preview templates, and export resumes in multiple formats.",
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT Authentication", "PDF Generation", "DOCX Generation"],
    image: "/projects/fallback.svg",
    imageAlt: "OptiResume live product screenshot placeholder",
  },
  {
    slug: "portfolio-builder",
    title: "Portfolio Builder",
    category: "AI Portfolio Builder",
    description:
      "AI-powered portfolio builder that turns a resume into a polished, responsive professional website with guided setup, template selection, dashboard management, and no-code publishing.",
    tech: ["React", "Vite", "Tailwind CSS", "JavaScript", "Responsive Design", "Dashboard UI", "Template System", "Vercel"],
    image: "/projects/portfolio-builder-home.png",
    imageAlt: "Portfolio Builder AI portfolio maker landing page",
  },
  {
    slug: "support-kindness",
    title: "Care Contribution",
    category: "Community Impact Platform",
    description:
      "Community kindness platform for animal feeding, poor people help, tree plantation, food distribution, transparency reports, gallery, contact, and admin dashboard.",
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Admin Dashboard", "Image Upload", "Vercel", "Render"],
    image: "/projects/support-kindness-homepage.png",
    imageAlt: "Care Contribution community support homepage",
  },
  {
    slug: "charityvibe",
    title: "CharityVibe",
    category: "Donation Platform",
    description:
      "Donation and charity support platform with donation flow, volunteer and support pages, responsive UI, and community-focused design.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Donation Flow", "Email/OTP", "Vercel", "Render"],
    image: "/projects/charityvibe-donation-page.png",
    imageAlt: "CharityVibe donation platform page",
  },
  {
    slug: "stock-market-prediction-ml",
    title: "Stock Market Prediction ML",
    category: "Machine Learning",
    description:
      "Machine learning-based stock market prediction project that analyzes historical market data and generates predictive insights using data science and forecasting techniques.",
    tech: ["Python", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "Data Analysis", "Predictive Modeling"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    imageAlt: "Stock market prediction project visual",
  },
];

const projectRoutes = projectMeta.map((project) => ({
  path: `/projects/${project.slug}`,
  title: `${project.title} by Aditaya`,
  description: `${project.title} case study by Aditaya Kumar Mishra. ${project.description}`,
  keywords: [
    `${project.title} Aditaya`,
    `${project.title} Aditaya Kumar Mishra`,
    `Aditaya ${project.category}`,
    "Aditaya project",
    "Aditaya portfolio project",
    project.title,
    project.category,
    ...project.tech,
  ],
  image: project.image,
  imageAlt: project.imageAlt,
  schemaType: "WebPage",
}));

const routes = [
  {
    path: "/",
    title: "Aditaya Kumar Mishra Portfolio",
    fullTitle: "Aditaya Kumar Mishra Portfolio | Aditaya Full Stack MERN Developer",
    description:
      "Aditaya Kumar Mishra portfolio, also searchable as Aditaya, Aditya, Aditaya Mishra, and adityamishra52. Full Stack MERN Developer building React, Vite, Node.js, MongoDB, AI web apps, SEO-ready websites, and modern web products.",
    keywords: ["Aditaya", "Aditya", "Aditaya portfolio", "Aditaya Kumar Mishra portfolio", "Aditaya full stack developer", "adityamishra52 portfolio"],
    schemaType: "WebPage",
  },
  {
    path: "/about",
    title: "About Aditaya Kumar Mishra",
    description:
      "About Aditaya Kumar Mishra, also known as Aditaya and Aditya Mishra. Full Stack MERN Developer focused on React, Vite, Node.js, MongoDB, AI web apps, SEO, testing, and modern product delivery.",
    keywords: ["About Aditaya", "Aditaya Mishra about", "Aditya Mishra about", "Aditaya Kumar Mishra bio", "Aditaya developer profile"],
    schemaType: "AboutPage",
  },
  {
    path: "/skills",
    title: "Aditaya Skills",
    description:
      "Skills of Aditaya Kumar Mishra across React, Vite, Tailwind CSS, Node.js, Express, MongoDB, SEO, deployment, AI web app development, testing, and MERN projects.",
    keywords: ["Aditaya skills", "Aditaya developer skills", "Aditaya React skills", "Aditaya MERN skills", "Aditaya SEO skills"],
    schemaType: "WebPage",
  },
  {
    path: "/projects",
    title: "Aditaya Projects",
    description:
      "Featured projects by Aditaya Kumar Mishra including BoostPilot AI, OptiResume, Portfolio Builder, Care Contribution, CharityVibe, and Stock Market Prediction ML.",
    keywords: ["Aditaya projects", "Aditaya portfolio projects", "Aditaya Kumar Mishra projects", "Aditaya MERN projects", "Aditaya AI projects"],
    schemaType: "WebPage",
  },
  ...projectRoutes,
  {
    path: "/gallery",
    title: "Aditaya Project Gallery",
    description:
      "Aditaya Kumar Mishra project gallery with screenshots and previews from full stack MERN, AI, portfolio builder, donation, dashboard, and machine learning projects.",
    keywords: ["Aditaya gallery", "Aditaya project screenshots", "Aditaya portfolio gallery", "Aditaya Kumar Mishra gallery", "adityamishra52 gallery"],
    schemaType: "WebPage",
  },
  {
    path: "/experience",
    title: "Aditaya Experience",
    description:
      "Work experience of Aditaya Kumar Mishra including Manuscript Technomedia LLP, website testing, SEO, React, Vite, Node.js, MongoDB, Vercel, and Render.",
    keywords: ["Aditaya experience", "Aditaya work experience", "Aditaya Kumar Mishra experience", "Aditaya SEO executive", "Aditaya web developer experience"],
    schemaType: "WebPage",
  },
  {
    path: "/education",
    title: "Aditaya Education",
    description:
      "Education details for Aditaya Kumar Mishra, Computer Science and Engineering graduate with hands-on MERN, AI, SEO, and web development project experience.",
    keywords: ["Aditaya education", "Aditaya Kumar Mishra education", "Aditaya computer science", "Aditaya CSE", "Aditaya academic profile"],
    schemaType: "WebPage",
  },
  {
    path: "/contact",
    title: "Contact Aditaya",
    description:
      "Contact Aditaya Kumar Mishra, also known as Aditaya Mishra and adityamishra52, for messages, collaboration ideas, portfolio questions, web development, SEO, and project discussions.",
    keywords: ["Contact Aditaya", "Aditaya contact", "Aditaya Kumar Mishra contact", "Aditaya email", "adityamishra52 contact"],
    schemaType: "ContactPage",
  },
  {
    path: "/hire-me",
    title: "Hire Aditaya",
    description:
      "Hire Aditaya Kumar Mishra, Full Stack MERN Developer, to build fast, modern, SEO-ready web apps, dashboards, portfolio websites, AI tools, and premium business websites.",
    keywords: ["Hire Aditaya", "Hire Aditaya Kumar Mishra", "Aditaya freelance developer", "Aditaya MERN developer hire", "Aditaya web developer hire"],
    schemaType: "WebPage",
  },
];

const absoluteUrl = (value = "/") => {
  if (!value) return `${siteUrl}/`;
  if (value.startsWith("http")) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

const routeLabel = (segment) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const buildBreadcrumb = (routePath, url) => {
  const segments = routePath === "/" ? [] : routePath.split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
    ...segments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: routeLabel(segment),
      item: `${siteUrl}/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: items };
};

const escapeAttr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const setMetaContent = (html, attr, value, matchValue) => {
  const tagRegex = new RegExp(`<meta[^>]*${attr}="${matchValue}"[\\s\\S]*?/?>`, "i");
  return html.replace(tagRegex, (tag) => tag.replace(/content="[^"]*"/, `content="${escapeAttr(value)}"`));
};

const setLinkHref = (html, rel, value) => {
  const tagRegex = new RegExp(`<link[^>]*rel="${rel}"[^>]*/?>`, "i");
  return html.replace(tagRegex, (tag) => tag.replace(/href="[^"]*"/, `href="${escapeAttr(value)}"`));
};

// rel="alternate" tags need the hreflang value matched too, since href sits
// between rel and hreflang in attribute order and a plain rel-based match
// would clobber both language-alternate tags with the same href.
const setAlternateHref = (html, hreflangValue, value) => {
  const tagRegex = new RegExp(`<link(?=[^>]*rel="alternate")(?=[^>]*hreflang="${hreflangValue}")[^>]*/?>`, "i");
  return html.replace(tagRegex, (tag) => tag.replace(/href="[^"]*"/, `href="${escapeAttr(value)}"`));
};

function renderRouteHtml(baseHtml, route) {
  const url = absoluteUrl(route.path);
  const fullTitle = route.fullTitle || `${route.title} | ${authorName}`;
  const keywordText = [...new Set([...baseKeywords, ...(route.keywords || [])])].join(", ");
  const imageUrl = absoluteUrl(route.image || "/og-image.png");
  const imageAlt = route.imageAlt || `${authorName} full stack developer portfolio preview`;

  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  html = setMetaContent(html, "name", route.description, "description");
  html = setMetaContent(html, "name", keywordText, "keywords");
  html = setMetaContent(html, "property", fullTitle, "og:title");
  html = setMetaContent(html, "property", route.description, "og:description");
  html = setMetaContent(html, "property", url, "og:url");
  html = setMetaContent(html, "property", imageUrl, "og:image");
  html = setMetaContent(html, "property", imageUrl, "og:image:secure_url");
  html = setMetaContent(html, "property", imageAlt, "og:image:alt");
  html = setMetaContent(html, "name", fullTitle, "twitter:title");
  html = setMetaContent(html, "name", route.description, "twitter:description");
  html = setMetaContent(html, "name", imageUrl, "twitter:image");
  html = setMetaContent(html, "name", imageAlt, "twitter:image:alt");

  html = setLinkHref(html, "canonical", url);
  html = setAlternateHref(html, "en-in", url);
  html = setAlternateHref(html, "x-default", url);

  // The homepage hero image preload is dead weight on every other route -
  // each route either has no matching LCP image or (for project pages) a
  // different one, so keep this preload scoped to "/" only.
  if (route.path !== "/") {
    html = html.replace(/\s*<link rel="preload" as="image" href="\/Aditaya\.png" fetchpriority="high" \/>\n?/, "\n");
  }

  const routeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": route.schemaType || "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: fullTitle,
        headline: fullTitle,
        alternateName: alternateNames,
        description: route.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
        author: { "@id": `${siteUrl}/#person` },
        creator: { "@id": `${siteUrl}/#person` },
        primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        keywords: keywordText,
        inLanguage: "en-IN",
      },
      buildBreadcrumb(route.path, url),
    ],
  };

  const jsonLdScript = `<script type="application/ld+json" id="route-json-ld">${JSON.stringify(routeSchema)}</script>`;
  html = html.replace("</head>", `  ${jsonLdScript}\n  </head>`);

  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>
      <main>
        <h1>${escapeHtml(fullTitle)}</h1>
        <p>${escapeHtml(route.description)}</p>
        <p><a href="/">Back to the Aditaya Kumar Mishra portfolio home page</a></p>
      </main>
    </noscript>`
  );

  return html;
}

function writeRoute(baseHtml, route) {
  const html = renderRouteHtml(baseHtml, route);
  if (route.path === "/") {
    writeFileSync(path.join(distDir, "index.html"), html);
    return;
  }
  const outDir = path.join(distDir, ...route.path.split("/").filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html);
}

const baseHtml = readFileSync(path.join(distDir, "index.html"), "utf8");
for (const route of routes) {
  writeRoute(baseHtml, route);
}

console.log(`Prerendered ${routes.length} routes with route-specific canonical/meta tags into dist/.`);
