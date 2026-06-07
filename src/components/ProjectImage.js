import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const initialSrc = src || FALLBACK_SRC;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(!src);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_SRC);
    setIsLoading(true);
    setShowFallback(!src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (currentSrc !== FALLBACK_SRC) {
      setShowFallback(true);
      setCurrentSrc(FALLBACK_SRC);
      setIsLoading(true);
      return;
    }

    setShowFallback(true);
    setIsLoading(false);
  };

  const maxHeightStyle = maxHeight ? { maxHeight } : undefined;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={!isLoading ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      onClick={onClick}
    >
      {isLoading && <div className="absolute inset-0 z-0 animate-pulse bg-slate-800" style={maxHeightStyle} />}

      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        data-fallback={showFallback ? "true" : "false"}
        className={`relative z-10 block h-full w-full object-cover transition duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${imageClassName}`}
        style={maxHeightStyle}
      />
    </motion.div>
  );
}
