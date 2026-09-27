import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import optimizedImage from "../utils/optimizedImage";

const FALLBACK_SRC = "/projects/fallback.svg";

export default function ProjectImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  maxHeight = "",
  onClick = null,
  priority = false,
  sizes,
}) {
  const original = src || FALLBACK_SRC;
  // Try the WebP copy first, then the original file, then the placeholder graphic.
  const candidates = [...new Set([optimizedImage(original), original, FALLBACK_SRC])];
  const [failed, setFailed] = useState({ for: original, count: 0 });
  const attempt = failed.for === original ? failed.count : 0;
  const currentSrc = candidates[Math.min(attempt, candidates.length - 1)];

  // "Loaded" is tracked per URL, so a new src starts hidden and a late event for an old src can't hide a new one.
  const [loadedSrc, setLoadedSrc] = useState(null);
  const isLoading = loadedSrc !== currentSrc;
  const imgRef = useRef(null);

  // An image already in the browser cache can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoadedSrc(currentSrc);
  }, [currentSrc]);

  const handleError = () => {
    if (attempt < candidates.length - 1) setFailed({ for: original, count: attempt + 1 });
    else setLoadedSrc(currentSrc); // nothing left to try: stop the shimmer
  };

  const maxHeightStyle = maxHeight ? { maxHeight } : undefined;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 z-0 animate-pulse bg-slate-200 dark:bg-slate-800" style={maxHeightStyle} aria-hidden="true" />
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoadedSrc(currentSrc)}
        onError={handleError}
        sizes={sizes}
        data-fallback={currentSrc === FALLBACK_SRC ? "true" : "false"}
        className={`relative z-10 block h-full w-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${imageClassName}`}
        style={maxHeightStyle}
      />
    </motion.div>
  );
}
