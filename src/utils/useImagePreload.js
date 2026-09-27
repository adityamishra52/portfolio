import { useEffect } from "react";
import optimizedImage from "./optimizedImage";

export default function useImagePreload(sources) {
  // Preload the same files ProjectImage shows (the WebP copies), so nothing downloads twice
  const preloadKey = (sources || []).filter(Boolean).map(optimizedImage).join("|");

  useEffect(() => {
    const imageSources = [...new Set(preloadKey.split("|").filter(Boolean))];
    const preloadLinks = [];

    imageSources.forEach((href, index) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      if (index === 0) {
        link.setAttribute("fetchpriority", "high");
      }
      document.head.appendChild(link);
      preloadLinks.push(link);

      const image = new window.Image();
      image.decoding = "async";
      image.src = href;
    });

    return () => {
      preloadLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [preloadKey]);
}
