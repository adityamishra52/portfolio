import { useEffect, useRef } from "react";

const SPOTLIGHT_SELECTOR = ".glass-card, .feature-card, .skill-card, .spotlight";

// One delegated pointer listener drives both the page-level glow and the
// per-card hover spotlight (via --mx/--my), instead of a listener per card.
function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return undefined;

    let frame = 0;
    let lastEvent = null;

    const update = () => {
      frame = 0;
      if (!lastEvent) return;
      const { clientX, clientY, target } = lastEvent;

      glowRef.current?.style.setProperty("transform", `translate3d(${clientX}px, ${clientY}px, 0)`);

      const card = target instanceof Element ? target.closest(SPOTLIGHT_SELECTOR) : null;
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${clientX - rect.left}px`);
        card.style.setProperty("--my", `${clientY - rect.top}px`);
      }
    };

    const handleMove = (event) => {
      lastEvent = event;
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    glowRef.current?.classList.add("is-active");
    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}

export default CursorGlow;
