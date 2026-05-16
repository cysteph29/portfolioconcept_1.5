"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      {
        // Trigger as content reaches the lower viewport zone.
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={nodeRef} className={className} data-visible={isVisible ? "true" : undefined}>
      {children}
    </div>
  );
}
