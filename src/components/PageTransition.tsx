"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CASE_STUDY_ENTRY_DURATION_S,
  CASE_STUDY_ENTRY_RISE_PX,
  CASE_STUDY_EXIT_DURATION_S,
  HOMEPAGE_ENTRY_DURATION_S,
  HOMEPAGE_EXIT_DURATION_S,
  TRANSITION_EASING,
  clearNavIntent,
  peekNavIntent,
  prefersReducedMotion,
  setNavIntent,
  type NavIntent,
} from "@/src/lib/transitions";

type RouteKind = "home" | "case" | "other";

function routeKindOf(pathname: string): RouteKind {
  if (pathname === "/") {
    return "home";
  }
  if (/^\/work\/[^/]+$/.test(pathname)) {
    return "case";
  }
  return "other";
}

// Resting (final) state. y: 0 is explicit so case study entrances that start
// with a positive y value animate back to baseline.
const REST = { opacity: 1, y: 0 } as const;

// Homepage: pure opacity fade, no transform.
const HOMEPAGE_FADED = { opacity: 0 } as const;

// Case study entry: opacity + subtle rise (felt, not seen).
const CASE_ENTRY_STATE = { opacity: 0, y: CASE_STUDY_ENTRY_RISE_PX } as const;

// Case study exit: pure opacity fade, no transform.
const CASE_EXIT_FADED = { opacity: 0 } as const;

interface TransitionContextValue {
  /**
   * Plays the current route's exit animation, then navigates. `intent` flags the
   * destination so it can play its matching entrance on mount.
   */
  navigate: (href: string, intent: NavIntent) => void;
  /**
   * True when the current route mount is an in-app transition entrance (not a
   * direct visit / refresh). Child pages use this to skip their own intro
   * animations so they do not fight the wrapper animation.
   */
  enteredViaTransition: boolean;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useRouteTransition(): TransitionContextValue {
  const value = useContext(TransitionContext);
  if (!value) {
    throw new Error("useRouteTransition must be used within <PageTransition>");
  }
  return value;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimationControls();

  // The wrapper DOM node. will-change is set imperatively (not via React state)
  // so the animating element never re-renders mid-animation, which would
  // interrupt Motion and leave its completion promise unresolved.
  // The value is route-aware: case study paths animate transform + opacity,
  // homepage paths animate opacity only.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const setWillChange = useCallback((val: string) => {
    if (wrapperRef.current) {
      wrapperRef.current.style.willChange = val;
    }
  }, []);

  // Blocks a second navigation while an exit is mid-flight (ignore extra clicks).
  const isTransitioningRef = useRef(false);

  // Latch the entrance decision for the current route mount into state so it
  // stays stable for the lifetime of that mount (child pages read it). The
  // intent is peeked (not cleared) here, which is safe to call during render
  // and under StrictMode's doubled render; it is cleared later in an effect.
  // The lazy initializer ignores any module intent so a direct visit / refresh
  // never animates.
  const [entrance, setEntrance] = useState<{ path: string; kind: RouteKind; intent: NavIntent }>(
    () => ({ path: pathname, kind: routeKindOf(pathname), intent: null }),
  );

  if (entrance.path !== pathname) {
    setEntrance({ path: pathname, kind: routeKindOf(pathname), intent: peekNavIntent() });
  }

  const reduced = prefersReducedMotion();
  const enteredViaTransition =
    !reduced &&
    ((entrance.kind === "home" && entrance.intent === "to-home") ||
      (entrance.kind === "case" && entrance.intent === "to-case"));

  // Entrance: runs on every route mount. Coming out of an exit the wrapper is
  // already at opacity 0, so snapping to the entrance start state is invisible
  // (no flash); during a direct visit nothing animates.
  useEffect(() => {
    isTransitioningRef.current = false;
    clearNavIntent();

    if (reduced) {
      controls.set(REST);
      setWillChange("auto");
      window.dispatchEvent(new CustomEvent("routetransitionend"));
      return;
    }

    let cancelled = false;

    const playEntrance = async (
      from: typeof HOMEPAGE_FADED | typeof CASE_ENTRY_STATE,
      willChangeVal: string,
      duration: number,
    ) => {
      controls.set(from);
      setWillChange(willChangeVal);
      try {
        await controls.start(REST, { duration, ease: TRANSITION_EASING });
      } finally {
        if (!cancelled) {
          setWillChange("auto");
          window.dispatchEvent(new CustomEvent("routetransitionend"));
        }
      }
    };

    if (entrance.kind === "home" && entrance.intent === "to-home") {
      void playEntrance(HOMEPAGE_FADED, "opacity", HOMEPAGE_ENTRY_DURATION_S);
    } else if (entrance.kind === "case" && entrance.intent === "to-case") {
      void playEntrance(CASE_ENTRY_STATE, "transform, opacity", CASE_STUDY_ENTRY_DURATION_S);
    } else {
      // Direct visit, refresh, or an unrelated navigation: render at rest.
      controls.set(REST);
      setWillChange("auto");
      window.dispatchEvent(new CustomEvent("routetransitionend"));
    }

    return () => {
      cancelled = true;
    };
    // The animation is keyed to the latched entrance for this mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entrance]);

  const navigate = useCallback(
    (href: string, intent: NavIntent) => {
      if (reduced) {
        setNavIntent(null);
        router.push(href);
        return;
      }

      // Ignore extra clicks while an exit is already running so we never
      // double-fire navigations.
      if (isTransitioningRef.current) {
        return;
      }
      isTransitioningRef.current = true;
      setNavIntent(intent);

      const currentKind = routeKindOf(pathname);

      const runExit = async (
        target: typeof HOMEPAGE_FADED | typeof CASE_EXIT_FADED,
        willChangeVal: string,
        duration: number,
      ) => {
        setWillChange(willChangeVal);
        await controls.start(target, { duration, ease: TRANSITION_EASING });
        router.push(href);
      };

      if (currentKind === "home") {
        void runExit(HOMEPAGE_FADED, "opacity", HOMEPAGE_EXIT_DURATION_S);
      } else if (currentKind === "case") {
        void runExit(CASE_EXIT_FADED, "opacity", CASE_STUDY_EXIT_DURATION_S);
      } else {
        // No bespoke exit for other routes; navigate straight away. The
        // destination still plays its entrance via the intent flag.
        router.push(href);
      }
    },
    [controls, pathname, reduced, router, setWillChange],
  );

  // Back button parity: on a case study, intercept the browser Back so it plays
  // the same exit animation as the close button, then routes home. A sentinel
  // history entry is pushed so the first Back lands here (same URL, no visual
  // change) where we can animate before leaving. Disabled under reduced motion,
  // where Back falls through to plain browser navigation.
  useEffect(() => {
    if (reduced || routeKindOf(pathname) !== "case") {
      return;
    }

    window.history.pushState({ __csTransitionGuard: true }, "");

    let handled = false;
    const onPopState = () => {
      if (handled) {
        return;
      }
      handled = true;
      window.removeEventListener("popstate", onPopState);

      setNavIntent("to-home");
      isTransitioningRef.current = true;
      setWillChange("opacity");
      void controls
        .start(CASE_EXIT_FADED, {
          duration: CASE_STUDY_EXIT_DURATION_S,
          ease: TRANSITION_EASING,
        })
        .then(() => {
          // Route home explicitly (matches the close button) so this stays
          // correct even on a direct visit with no homepage in history.
          router.push("/");
        });
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, reduced]);

  return (
    <TransitionContext.Provider value={{ navigate, enteredViaTransition }}>
      <motion.div
        ref={wrapperRef}
        className="flex min-h-dvh flex-1 flex-col"
        initial={false}
        animate={controls}
        style={{ willChange: "auto" }}
      >
        {children}
      </motion.div>
    </TransitionContext.Provider>
  );
}
