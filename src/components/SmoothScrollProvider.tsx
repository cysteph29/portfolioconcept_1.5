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

    // Land fresh page loads at the top instead of letting the browser restore
    // the previous scroll position. A restored position is applied before the
    // async Typekit headline font swaps in; that swap reflows the hero and
    // pushes everything below it down by a load-dependent amount, which read as
    // a random few-pixel offset on every load. At the very top there is nothing
    // above the viewport for the reflow to shift, so the offset disappears.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

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

    // Pin to the top now and again once web fonts have finished loading, so the
    // headline reflow cannot leave a residual offset behind. Deep links to an
    // in-page anchor (e.g. #contact) are left untouched.
    let cancelled = false;
    const pinToTop = () => {
      if (cancelled || window.location.hash) {
        return;
      }
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    pinToTop();
    void document.fonts?.ready.then(pinToTop);

    const handleReducedMotionChange = () => {
      initLenis();
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      cancelled = true;
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
