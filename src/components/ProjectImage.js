import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProjectImage({ src, alt, className = "", maxHeight = "", onClick = null }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  const handleError = () => setError(true);
  const handleLoad = () => setLoaded(true);

  const srcFinal = error || !src ? "/projects/fallback.svg" : src;
  const maxHeightStyle = maxHeight ? { maxHeight } : undefined;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={loaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800" style={maxHeightStyle}>
          <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      )}

      <img
        src={srcFinal}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-transform duration-500 ${loaded ? "" : "opacity-0"}`}
        style={maxHeightStyle}
      />
    </motion.div>
  );
}
