import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const PHOTO_SRC = "/hero-desk.webp";
// Shown until a GIF/video is uploaded from Admin > Settings > Hero Animation.
const DEFAULT_ANIME_SRC = "/hero-desk-anime.webp";
const ANIME_MEDIA_URL = "/api/profile-image?slot=anime";
const LOGO_SRC = "/logo.png";

// dwell = how long each slide stays fully visible after its sweep finishes.
// persist = keep the layer mounted while hidden so it never reloads mid-sweep.
const SLIDES = [
  { key: "photo", dwell: 2000, persist: true, label: "Aditaya Kumar Mishra coding at his desk" },
  { key: "anime", dwell: 4000, persist: true, label: "Anime animation of Aditaya Kumar Mishra coding" },
  { key: "logo", dwell: 3000, persist: false, label: "Aditaya Kumar Mishra AK logo" },
];

const SWEEP_SECONDS = 0.95;
const SWEEP_EASE = [0.65, 0, 0.35, 1];
const MIN_VIDEO_DWELL = 3000;
const MAX_VIDEO_DWELL = 10000;

const SPARKLES = [
  { top: "14%", left: "18%", size: 18, delay: 0.2 },
  { top: "22%", left: "80%", size: 14, delay: 0.9 },
  { top: "58%", left: "10%", size: 12, delay: 1.5 },
  { top: "66%", left: "86%", size: 20, delay: 0.5 },
  { top: "8%", left: "56%", size: 10, delay: 1.2 },
];

function Sparkle({ size }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" fill="currentColor" />
    </svg>
  );
}

// Depth layer: the media is scaled up a little and shifted against the pointer,
// so it reads as sitting behind the ring glass (on top of TiltCard's tilt).
function ParallaxLayer({ parallax, depth, children }) {
  const x = useTransform(parallax.x, (value) => value * -depth);
  const y = useTransform(parallax.y, (value) => value * -depth);
  return (
    <motion.div className="absolute inset-[-8%]" style={{ x, y }}>
      {children}
    </motion.div>
  );
}

function PhotoSlide({ parallax }) {
  return (
    <ParallaxLayer parallax={parallax} depth={8}>
      <img
        src={PHOTO_SRC}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        width="720"
        height="720"
        className="h-full w-full object-cover"
      />
    </ParallaxLayer>
  );
}

function AnimeSlide({ parallax, active, cycle, media, onVideoDuration }) {
  const videoRef = useRef(null);

  // The layer stays mounted, so restart the clip each time it sweeps in
  // (cycle changes) and pause it while hidden.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, cycle, media.src]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ParallaxLayer parallax={parallax} depth={14}>
        {/* Not keyed by cycle: that would remount (and reload) the video. */}
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1 }}
          animate={{ scale: active ? 1.08 : 1 }}
          transition={active ? { duration: 6, ease: "easeOut" } : { duration: 0 }}
        >
          {media.isVideo ? (
            <video
              ref={videoRef}
              src={media.src}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => onVideoDuration(event.currentTarget.duration)}
            />
          ) : (
            <img src={media.src} alt="" decoding="async" width="720" height="720" className="h-full w-full object-cover" />
          )}
        </motion.div>
      </ParallaxLayer>

      {active && (
        <div key={cycle} className="pointer-events-none absolute inset-0">
          {/* One diagonal shine pass shortly after the reveal lands. */}
          <motion.div
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            initial={{ x: "0%", skewX: -18 }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, delay: SWEEP_SECONDS + 0.2, ease: "easeInOut" }}
          />
          {SPARKLES.map((sparkle) => (
            <motion.span
              key={`${sparkle.top}-${sparkle.left}`}
              className="absolute text-white drop-shadow-[0_0_6px_rgba(94,234,212,0.9)]"
              style={{ top: sparkle.top, left: sparkle.left }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90, 180] }}
              transition={{ duration: 1.6, delay: sparkle.delay, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
            >
              <Sparkle size={sparkle.size} />
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

function LogoSlide() {
  return (
    <div className="relative grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_42%,rgba(45,212,191,0.4),transparent_62%),linear-gradient(140deg,#0f172a,#1e1b4b)]">
      <motion.span
        className="absolute h-[62%] w-[62%] rounded-[28%] bg-teal-400/30 blur-2xl"
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={LOGO_SRC}
        alt=""
        decoding="async"
        width="512"
        height="512"
        className="relative w-[58%] drop-shadow-2xl"
        initial={{ scale: 0.55, rotate: -14, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: SWEEP_SECONDS * 0.45 }}
      />
    </div>
  );
}

function useAnimeMedia() {
  const [media, setMedia] = useState({ src: DEFAULT_ANIME_SRC, isVideo: false });

  useEffect(() => {
    let cancelled = false;
    fetch(`${ANIME_MEDIA_URL}&meta=1`)
      .then((response) => (response.ok ? response.json() : null))
      .then((meta) => {
        if (cancelled || !meta?.hasCustomMedia) return;
        const version = meta.updatedAt ? new Date(meta.updatedAt).getTime() : "1";
        setMedia({
          src: `${ANIME_MEDIA_URL}&v=${version}`,
          isVideo: Boolean(meta.contentType?.startsWith("video/")),
        });
      })
      // No API (e.g. plain Vite dev) or no upload: keep the default image.
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return media;
}

function HeroPortraitCarousel() {
  const reduceMotion = useReducedMotion();
  const media = useAnimeMedia();
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState(null);
  // How many times each slide has swept in; keys its entrance effects.
  const [entries, setEntries] = useState(() => SLIDES.map(() => 0));
  const [videoDwell, setVideoDwell] = useState(null);
  const [paused, setPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const indexRef = useRef(0);
  const sweepRef = useRef(null);

  const angle = useMotionValue(360);
  // Drives the conic mask on whichever layer has .is-incoming (see index.css).
  // A CSS variable plus a React-managed class avoids re-binding mask styles as
  // layers switch between incoming and background roles.
  const sweepAngle = useTransform(angle, (value) => `${value}deg`);
  const trailGlow = useTransform(
    angle,
    (value) => `conic-gradient(from ${value - 70}deg, transparent 0deg, rgba(94, 234, 212, 0.4) 70deg, transparent 70.5deg)`
  );
  const handOpacity = useTransform(angle, [0, 18, 330, 360], [0, 1, 1, 0]);

  // Pointer position over the frame, -1..1 on each axis, smoothed.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const parallax = {
    x: useSpring(pointerX, { stiffness: 120, damping: 18 }),
    y: useSpring(pointerY, { stiffness: 120, damping: 18 }),
  };

  const sweeping = previous !== null;

  const advance = useCallback(() => {
    const current = indexRef.current;
    const next = (current + 1) % SLIDES.length;
    indexRef.current = next;
    sweepRef.current?.stop();
    setIndex(next);
    setEntries((counts) => counts.map((count, slideIndex) => (slideIndex === next ? count + 1 : count)));

    if (reduceMotion) {
      setPrevious(null);
      return;
    }

    setPrevious(current);
    angle.set(0);
    sweepRef.current = animate(angle, 360, {
      duration: SWEEP_SECONDS,
      ease: SWEEP_EASE,
      onComplete: () => setPrevious(null),
    });
  }, [angle, reduceMotion]);

  useEffect(() => () => sweepRef.current?.stop(), []);

  // Warm the logo (and the default anime image) after mount, not via
  // <link rel=preload>, so they don't compete with the hero photo (the LCP).
  useEffect(() => {
    [DEFAULT_ANIME_SRC, LOGO_SRC].forEach((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // An uploaded video plays through once before moving on (within limits). It
  // starts as it sweeps in and should end as the next slide finishes sweeping
  // over it, so both sweeps come off its duration.
  const handleVideoDuration = useCallback((seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    const dwell = seconds * 1000 - 2 * SWEEP_SECONDS * 1000;
    setVideoDwell(Math.min(MAX_VIDEO_DWELL, Math.max(MIN_VIDEO_DWELL, dwell)));
  }, []);

  const dwellFor = (slideIndex) =>
    SLIDES[slideIndex].key === "anime" && media.isVideo && videoDwell ? videoDwell : SLIDES[slideIndex].dwell;

  // Autoplay counts each slide's dwell from the moment its sweep finishes, and
  // stops for reduced motion, hover/focus (so it can be paused), and hidden tabs.
  const currentDwell = dwellFor(index);
  useEffect(() => {
    if (reduceMotion || paused || pageHidden || sweeping) return undefined;
    const timer = window.setTimeout(advance, currentDwell);
    return () => window.clearTimeout(timer);
  }, [advance, currentDwell, paused, pageHidden, reduceMotion, sweeping]);

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const visible = sweeping ? [previous, index] : [index];
  const layers = SLIDES.map((_, slideIndex) => slideIndex).filter(
    (slideIndex) => SLIDES[slideIndex].persist || visible.includes(slideIndex)
  );
  const nextSlide = SLIDES[(index + 1) % SLIDES.length];

  const renderSlide = (slideIndex) => {
    const slide = SLIDES[slideIndex];
    if (slide.key === "photo") return <PhotoSlide parallax={parallax} />;
    if (slide.key === "anime") {
      return (
        <AnimeSlide
          parallax={parallax}
          active={visible.includes(slideIndex)}
          cycle={entries[slideIndex]}
          media={media}
          onVideoDuration={handleVideoDuration}
        />
      );
    }
    return <LogoSlide />;
  };

  return (
    <motion.button
      type="button"
      className="portrait-frame"
      style={{ "--sweep": sweepAngle }}
      onClick={advance}
      onPointerMove={handlePointerMove}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={() => {
        setPaused(false);
        pointerX.set(0);
        pointerY.set(0);
      }}
      // Only keyboard focus pauses; a mouse click also focuses the button and
      // must not freeze autoplay until the user clicks elsewhere.
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) setPaused(true);
      }}
      onBlur={() => setPaused(false)}
      aria-label={`${SLIDES[index].label}. Show next: ${nextSlide.label}`}
    >
      {layers.map((slideIndex) => {
        const isIncoming = sweeping && slideIndex === index;
        const isHidden = !visible.includes(slideIndex);

        return (
          <div
            key={SLIDES[slideIndex].key}
            className={`portrait-layer${isIncoming ? " is-incoming" : ""}${isHidden ? " invisible" : ""}`}
            aria-hidden="true"
          >
            {renderSlide(slideIndex)}
          </div>
        );
      })}

      {sweeping && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 z-[3] rounded-full"
            style={{ background: trailGlow, opacity: handOpacity }}
          />
          <motion.div className="pointer-events-none absolute inset-0 z-[4]" style={{ rotate: angle, opacity: handOpacity }}>
            <span className="absolute left-1/2 top-0 h-1/2 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white via-teal-200 to-transparent shadow-[0_0_16px_4px_rgba(94,234,212,0.85)]" />
          </motion.div>
        </>
      )}
    </motion.button>
  );
}

export default HeroPortraitCarousel;
