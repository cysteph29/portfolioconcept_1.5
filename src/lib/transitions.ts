/**
 * Shared, tunable constants and helpers for the homepage / case study route
 * transition. Both the homepage and the case study routes reference these so
 * the two independent animations stay in sync as the values are tuned.
 */

// Homepage exit (forward navigation, homepage -> case study).
export const HOMEPAGE_EXIT_DURATION_S = 0.75;

// Homepage entrance (back navigation, case study -> homepage).
export const HOMEPAGE_ENTRY_DURATION_S = 0.75;

// Case study entrance (forward navigation, homepage -> case study).
// The subtle rise distance is intentionally small -- felt, not seen.
export const CASE_STUDY_ENTRY_RISE_PX = 16;
export const CASE_STUDY_ENTRY_DURATION_S = 0.85;

// Case study exit (back navigation, case study -> homepage).
// Pure opacity fade -- no transform on exit.
export const CASE_STUDY_EXIT_DURATION_S = 0.75;

// iOS-style ease-out shared by every leg of the transition.
export const TRANSITION_EASING = [0.32, 0.72, 0, 1] as const;

/**
 * Which animated leg the next route mount should play. Set imperatively just
 * before navigation and consumed once on the destination mount.
 *
 * "to-case": homepage -> case study (case study should fade + rise in).
 * "to-home": case study -> homepage (homepage should fade in).
 * null: direct visit / refresh / unrelated navigation (render at rest, no entrance).
 */
export type NavIntent = "to-case" | "to-home" | null;

// Module-level store. This survives App Router client side transitions because
// they reuse the same JS context, but resets to null on a full page load, which
// is exactly the signal we want for "direct visit / refresh => no entrance".
let pendingIntent: NavIntent = null;

export function setNavIntent(intent: NavIntent): void {
  pendingIntent = intent;
}

/**
 * Read the pending intent without clearing it. Safe to call during render
 * (including React StrictMode's doubled render) because it has no side effects.
 */
export function peekNavIntent(): NavIntent {
  return pendingIntent;
}

/** Clear the pending intent. Call from an effect once the destination has latched it. */
export function clearNavIntent(): void {
  pendingIntent = null;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
