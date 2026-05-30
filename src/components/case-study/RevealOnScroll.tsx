"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
}

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [scrolledIntoView, setScrolledIntoView] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        setScrolledIntoView(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const isVisible = reducedMotion || scrolledIntoView;

  return (
    <div ref={nodeRef} className={className} data-visible={isVisible ? "true" : undefined}>
      {children}
    </div>
  );
}
