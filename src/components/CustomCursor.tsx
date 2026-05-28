"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Drop the transparent mosaic PNG (just the green circle, no text, no square
// background) at this path. If the file is missing, the circle simply renders
// empty behind the live VIEW text.
const CURSOR_IMAGE_SRC = "/cursor-mosaic.png";

const CURSOR_SIZE_PX = 80;
const CURSOR_SCALE_DURATION_S = 0.25;
const CURSOR_TEXT = "VIEW";

// Cursor variant this component handles. Cards opt in with data-cursor="view".
// Other variants (e.g. "read") can reuse the same global listener later.
const CURSOR_SELECTOR = '[data-cursor="view"]';

function closestTarget(node: EventTarget | null): Element | null {
  return node instanceof Element ? node.closest(CURSOR_SELECTOR) : null;
}

export function CustomCursor() {
  const positionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    // Coarse pointers (touch) keep their native behavior: no listeners, no
    // cursor: none, nothing engages.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("custom-cursor-enabled");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReduceChange = () => setReducedMotion(reduce.matches);
    reduce.addEventListener("change", handleReduceChange);

    const half = CURSOR_SIZE_PX / 2;

    // Position follows the pointer 1:1 by writing the transform directly, so
    // there is no React re-render and no lag on the position itself.
    const handleMove = (event: PointerEvent) => {
      const node = positionRef.current;
      if (!node) return;
      node.style.transform = `translate(${event.clientX - half}px, ${event.clientY - half}px)`;
    };

    const handleOver = (event: PointerEvent) => {
      if (closestTarget(event.target)) setActive(true);
    };

    const handleOut = (event: PointerEvent) => {
      const from = closestTarget(event.target);
      const to = closestTarget(event.relatedTarget);
      // Only hide when leaving the target for something outside it; moving
      // between a card's own children should keep the cursor visible.
      if (from && from !== to) setActive(false);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("pointerout", handleOut, { passive: true });

    return () => {
      reduce.removeEventListener("change", handleReduceChange);
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);

  return (
    <div
      ref={positionRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 2147483647,
        willChange: "transform",
      }}
    >
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              duration: reducedMotion ? 0 : CURSOR_SCALE_DURATION_S,
              ease: "easeOut",
            }}
            style={{
              width: CURSOR_SIZE_PX,
              height: CURSOR_SIZE_PX,
              borderRadius: "50%",
              backgroundImage: `url(${CURSOR_IMAGE_SRC})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: 1,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              {CURSOR_TEXT}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
