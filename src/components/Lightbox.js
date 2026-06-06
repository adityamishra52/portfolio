import { useEffect, useState } from "react";

export default function Lightbox({ images = [], index = 0, open = false, onClose = () => {} }) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [failed, setFailed] = useState(false);
  const imageCount = images.length;

  useEffect(() => {
    setCurrentIndex(index);
    setFailed(false);
  }, [index, open]);

  useEffect(() => {
    setFailed(false);
  }, [currentIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && imageCount > 1) {
        setCurrentIndex((value) => (value - 1 + imageCount) % imageCount);
      }
      if (e.key === "ArrowRight" && imageCount > 1) {
        setCurrentIndex((value) => (value + 1) % imageCount);
      }
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imageCount, open, onClose]);

  if (!open) return null;

  const src = failed ? "/projects/fallback.svg" : images[currentIndex] || "/projects/fallback.svg";
  const showControls = imageCount > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Project screenshot preview"
    >
      <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-2 top-2 z-50 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-900 shadow"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
        {showControls && (
          <>
            <button
              className="absolute left-2 top-1/2 z-50 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl font-black text-slate-900 shadow"
              onClick={() => setCurrentIndex((value) => (value - 1 + imageCount) % imageCount)}
              type="button"
              aria-label="Previous image"
            >
              &lt;
            </button>
            <button
              className="absolute right-2 top-1/2 z-50 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl font-black text-slate-900 shadow"
              onClick={() => setCurrentIndex((value) => (value + 1) % imageCount)}
              type="button"
              aria-label="Next image"
            >
              &gt;
            </button>
          </>
        )}
        <img
          src={src}
          alt="Project screenshot"
          className="max-h-[82vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
          onError={() => setFailed(true)}
        />
        {showControls && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
            {currentIndex + 1} / {imageCount}
          </div>
        )}
      </div>
    </div>
  );
}
