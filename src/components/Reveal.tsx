"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useRouteTransition } from "@/src/components/PageTransition";
import {
  HOMEPAGE_HERO_REVEAL_DURATION_S,
  HOMEPAGE_HERO_REVEAL_RISE_PX,
  HOMEPAGE_SCROLL_REVEAL_DURATION_S,
  HOMEPAGE_SCROLL_REVEAL_RISE_PX,
  TRANSITION_EASING,
} from "@/src/lib/transitions";

type RevealVariant = "hero" | "scroll";

interface RevealProps {
  children: ReactNode;
  variant: RevealVariant;
  className?: string;
  delay?: number;
}

export function Reveal({ children, variant, className, delay = 0 }: RevealProps) {
  const { enteredViaTransition } = useRouteTransition();
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  if (reducedMotion || enteredViaTransition) {
    return (
      <div className={`w-full ${className ?? ""}`.trim()}>
        {children}
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <motion.div
        className={`w-full ${className ?? ""}`.trim()}
        initial={{ opacity: 0, y: HOMEPAGE_HERO_REVEAL_RISE_PX, scale: 0.985, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: HOMEPAGE_HERO_REVEAL_DURATION_S, delay, ease: TRANSITION_EASING }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`w-full ${className ?? ""}`.trim()}
      initial={{ opacity: 0, y: HOMEPAGE_SCROLL_REVEAL_RISE_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: HOMEPAGE_SCROLL_REVEAL_DURATION_S, delay, ease: TRANSITION_EASING }}
    >
      {children}
    </motion.div>
  );
}
