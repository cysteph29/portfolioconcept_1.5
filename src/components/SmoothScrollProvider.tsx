"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function isCaseStudyRoute(pathname: string) {
  return /^\/work\/[^/]+$/.test(pathname);
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initLenis = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;

      if (reducedMotionQuery.matches) {
        return;
      }

      lenisRef.current = new Lenis({
        autoRaf: true,
        anchors: true,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
      });
    };

    initLenis();

    const handleReducedMotionChange = () => {
      initLenis();
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;

    if (
      previousPathname &&
      previousPathname !== pathname &&
      isCaseStudyRoute(previousPathname) &&
      isCaseStudyRoute(pathname)
    ) {
      requestAnimationFrame(() => {
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      });
    }

    previousPathnameRef.current = pathname;
  }, [pathname]);

  return <>{children}</>;
}
