"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";

/* ---------------------------------------------------------------------------
 * Phase 1 idle float — tunable parameters
 *
 * All animation timings live here so they can be adjusted without hunting
 * through the component body. Values are locked per the design spec.
 * ------------------------------------------------------------------------- */

/** Vertical distance the avatar rises from its resting position, in px. */
const LIFT_PX = 32;

/** Time to travel up, in seconds. */
const RISE_DURATION_S = 0.6;

/** Hold time at the top before falling, in seconds. Set to 0: no pause at top. */
const TOP_PAUSE_S = 0;

/** Time to travel down, in seconds. */
const FALL_DURATION_S = 0.65;

/** Hold time at the bottom before rising again, in seconds. */
const BOTTOM_PAUSE_S = 2.15;

/* ---------------------------------------------------------------------------
 * Home position — single source of truth
 *
 * Both the idle float and the return-home animation reference this. Because
 * we animate via transform, "home" is simply { x: 0, y: 0 } relative to the
 * wrapper's natural layout position. The avatar never moves in the document
 * flow, which is what keeps surrounding content stable.
 * ------------------------------------------------------------------------- */
const HOME_POSITION = { x: 0, y: 0 } as const;

const AVATAR_SIZE_PX = 80;

/* ---------------------------------------------------------------------------
 * Phase 2 master flag
 *
 * When false, none of the dodge behavior runs: no proximity listener, no idle
 * timer, no dodge, no counter, no game-over logic. The bubble stays on its
 * Phase 1 resting copy ("touch me") and the component reduces to a pure
 * Phase 1 idle float with no dangling listeners or half-states. Treat this
 * as a fully supported state, useful for tuning the float in isolation.
 * ------------------------------------------------------------------------- */
const ENABLE_DODGE = true;

/* ---------------------------------------------------------------------------
 * Phase 2 cursor-dodge — tunable parameters
 * ------------------------------------------------------------------------- */

/** Cursor distance from the avatar center, in px, that triggers a dodge. */
const PROXIMITY_RADIUS_PX = 40;

/** How far the avatar leaps on each dodge, in px (pre-clamp to containment). */
const DODGE_DISTANCE_PX = 140;

/** Duration of a single dodge in seconds. Short on purpose: reads as a flinch. */
const DODGE_DURATION_S = 0.35;

/** Random angle jitter on the away-from-cursor vector, +/- in degrees. */
const DODGE_ANGLE_VARIATION_DEG = 35;

/**
 * Minimum ms between dodge starts. Below this we throttle proximity triggers
 * so a continuously-chasing cursor produces a chain of dodges instead of
 * thrashing on every pointermove (which can fire many times per frame).
 */
const DODGE_COOLDOWN_MS = 280;

/**
 * Maximum blend toward containment center when the avatar is at an edge.
 * 0 = pure away-from-cursor, 1 = pure toward-center. Scaled by edge nearness
 * so the bias only kicks in when the avatar is actually near an edge,
 * preventing it from cornering itself.
 */
const DODGE_EDGE_BIAS_MAX = 0.6;

/** Time with no proximity before the avatar glides back home, in ms. */
const IDLE_RETURN_MS = 1800;

/** Duration of the return-home glide, in seconds. */
const RETURN_DURATION_S = 0.7;

/* ---------------------------------------------------------------------------
 * Containment insets (relative to the hero section bounds)
 *
 * The containment rect is the hero section bounds inset by these values. It
 * is intentionally a roomy 2D box so the avatar may overlap the headline and
 * sub-copy while dodging. The hero section itself is the hard outer boundary;
 * the avatar never leaves it.
 * ------------------------------------------------------------------------- */

/** Inset from the section's top edge (clear of the nav), in px. */
const CONTAINMENT_PADDING_TOP_PX = 24;

/** Inset from the section's bottom edge (clear of whatever follows the hero), in px. */
const CONTAINMENT_PADDING_BOTTOM_PX = 32;

/** Inset from each horizontal edge of the hero section, in px. */
const CONTAINMENT_PADDING_X_PX = 24;

/* ---------------------------------------------------------------------------
 * 7-dodge cap + escalating bubble copy
 *
 * After MAX_DODGES proximity triggers, the avatar concedes: it does NOT
 * dodge away on the final trigger, glides home, shows the win message for
 * WIN_MESSAGE_DURATION_MS, then the bubble vanishes. The game does not reset
 * until the page is reloaded.
 *
 * The first MAX_DODGES - 1 triggers each get their own bubble line; the
 * final trigger gets the win message and ends the game.
 * ------------------------------------------------------------------------- */

/** Total proximity triggers before the avatar concedes. */
const MAX_DODGES = 7;

/**
 * Bubble copy for dodges 1 through MAX_DODGES - 1 (six lines). Order matters:
 * index i is shown when the (i + 1)th dodge fires.
 */
const DODGE_COPY: readonly string[] = [
  "Hehe",
  "So close!",
  "Not even close :D",
  "Oops",
  "Slow-mo",
  "Last one, I promise",
];

/** Line shown on the 7th trigger as the avatar concedes and glides home. */
const WIN_MESSAGE_COPY = "enough fun for now, check my work below.";

/**
 * How long the win message stays visible, counted from when it first appears
 * (covers both the glide-home and a hold afterward). When this elapses the
 * bubble vanishes; it does NOT revert to "touch me".
 */
const WIN_MESSAGE_DURATION_MS = 7000;

/** Bubble copy shown on proximity after the game is over. */
const POST_GAME_HOVER_COPY =
  "No-uh, check out my work first and then we'll play.";

/** Resting copy before any interaction (and on idle-return completion). */
const RESTING_BUBBLE_COPY = "Want a surprise?";

/* TODO: Phase 2 touch — coarse-pointer devices currently get no bubble at
 * all (per spec: "Just the static image with the headline below"). The
 * Phase 1 float still runs. A later styling pass can decide whether to
 * introduce a tap-to-hop fallback or a separate touch-only line; the float
 * and the static image are the only visible affordances in the meantime. */

type Mode = "floating" | "dodging" | "returning";

export function HeroAvatar() {
  const avatarRef = useRef<HTMLDivElement>(null);
  // Explicit <number>: HOME_POSITION is `as const`, so its members are literal
  // 0; without widening, animating to any other value fails to type-check.
  const xMv = useMotionValue<number>(HOME_POSITION.x);
  const yMv = useMotionValue<number>(HOME_POSITION.y);
  const shouldReduceMotion = useReducedMotion();

  /**
   * Bubble copy as a single string-or-null source of truth. `null` means the
   * bubble is not rendered at all (used for reduced-motion, coarse pointer,
   * and the post-game-after-7s-window state).
   */
  const [bubbleCopy, setBubbleCopy] = useState<string | null>(null);

  /* -- State machine internals (refs; do not drive re-renders) ----------- */
  /** Current motion mode. Used by the pointer handler to decide what to do. */
  const modeRef = useRef<Mode>("floating");
  /** Every in-flight playback control, so any transition can stop them all. */
  const activeAnimationsRef = useRef<AnimationPlaybackControls[]>([]);
  /**
   * Monotonic token bumped on every stopActive(). Async .then() handlers
   * compare against this to detect if a newer transition has taken over.
   */
  const animationGenRef = useRef(0);
  /** Idle timer: fires IDLE_RETURN_MS after the last in-proximity pointer event. */
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Timestamp of the last dodge start, for cooldown throttling. */
  const lastDodgeAtRef = useRef(0);

  /** How many proximity triggers have fired this page-load. Resets only on
   * idle-return completion or full unmount (page reload). */
  const dodgeCountRef = useRef(0);
  /** True after the 7th trigger has been processed. Locks out further dodges
   * and arming of the idle timer for the remainder of this page-load. */
  const gameOverRef = useRef(false);
  /** True for WIN_MESSAGE_DURATION_MS after the 7th trigger. While true,
   * the post-game hover line cannot replace the win message. */
  const winMessageActiveRef = useRef(false);
  /** The timer that clears the win message after WIN_MESSAGE_DURATION_MS. */
  const winMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  /* -- Stable helpers (only touch refs / motion values, so deps are empty) -- */

  const stopActive = useCallback(() => {
    for (const ctl of activeAnimationsRef.current) {
      ctl.stop();
    }
    activeAnimationsRef.current = [];
    animationGenRef.current += 1;
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  const clearWinMessageTimer = useCallback(() => {
    if (winMessageTimeoutRef.current !== null) {
      clearTimeout(winMessageTimeoutRef.current);
      winMessageTimeoutRef.current = null;
    }
  }, []);

  /** Mode is now tracked independently of bubble copy. Bubble copy is set
   * explicitly at each transition (see Phase 2 effect). */
  const setMode = useCallback((next: Mode) => {
    modeRef.current = next;
  }, []);

  /* ---- Phase 1 float loop (extracted so both initial mount and the
   * post-idle-return-home transition can start it without duplicating logic) ---- */
  const startFloat = useCallback(() => {
    stopActive();
    setMode("floating");

    const totalDuration = RISE_DURATION_S + FALL_DURATION_S + BOTTOM_PAUSE_S;

    // Keyframe schedule across one full loop (no top hold):
    //   0  -> home
    //   t1 -> top (rise complete; fall begins immediately)
    //   t2 -> home (fall complete; bottom rest begins)
    //   1  -> home (bottom pause held; identical to t2 for a seamless loop)
    const t1 = RISE_DURATION_S / totalDuration;
    const t2 = (RISE_DURATION_S + FALL_DURATION_S) / totalDuration;

    const yCtl = animate(
      yMv,
      [HOME_POSITION.y, -LIFT_PX, HOME_POSITION.y, HOME_POSITION.y],
      {
        duration: totalDuration,
        times: [0, t1, t2, 1],
        // easeOut on the rise decelerates into the apex; easeInOut on the fall
        // accelerates out of the apex then decelerates into the bottom for a
        // soft landing. Linear on the bottom hold animates between identical values.
        ease: ["easeOut", "easeInOut", "linear"],
        repeat: Infinity,
        repeatType: "loop",
      },
    );
    activeAnimationsRef.current = [yCtl];
  }, [stopActive, setMode, yMv]);

  /* ---- Phase 1 effect: start the float on mount ---- */
  useEffect(() => {
    if (shouldReduceMotion) {
      // Render statically at home. No animations, no listeners, no timers.
      return;
    }
    startFloat();
    return () => {
      stopActive();
      clearIdleTimer();
    };
  }, [shouldReduceMotion, startFloat, stopActive, clearIdleTimer]);

  /* ---- Bubble visibility / environment effect ----
   * Drives the resting bubble copy and forces the bubble off entirely on
   * reduced-motion and coarse-pointer devices. Listens for live changes to
   * (pointer: coarse) so an iPad-plus-mouse setup behaves correctly if the
   * primary pointer flips mid-session.
   *
   * Mid-game copy is NOT overwritten: we only set the resting line when the
   * game is in its untouched initial state. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(pointer: coarse)");

    const apply = () => {
      if (shouldReduceMotion || mql.matches) {
        setBubbleCopy(null);
        return;
      }
      if (!gameOverRef.current && dodgeCountRef.current === 0) {
        setBubbleCopy(RESTING_BUBBLE_COPY);
      }
    };

    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [shouldReduceMotion]);

  /* ---- Phase 2 effect: proximity dodge + idle return + 7-cap concede ---- */
  useEffect(() => {
    if (!ENABLE_DODGE) return;
    if (shouldReduceMotion) return;
    if (typeof window === "undefined") return;

    // Coarse-pointer devices have no real cursor; proximity dodge would
    // never trigger usefully. The float continues to run; the bubble is
    // hidden by the env effect above.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    /* -- One normal dodge (counts 1 through MAX_DODGES - 1) -- */
    const performDodgeMotion = (cursorX: number, cursorY: number) => {
      const avatar = avatarRef.current;
      if (!avatar) return;

      const rect = avatar.getBoundingClientRect();
      const currentCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      // "Home" in screen-space = current screen position minus current offset.
      // Recomputed per-dodge so we stay correct across scroll and layout shifts.
      const currentOffset = { x: xMv.get(), y: yMv.get() };
      const homeScreen = {
        x: currentCenter.x - currentOffset.x,
        y: currentCenter.y - currentOffset.y,
      };

      // Containment rect for the avatar's CENTER (inset by half the avatar
      // so the full avatar box stays inside the section). Derived from the
      // hero section bounds alone: a roomy 2D box that lets the avatar roam
      // freely across the full hero, including overlapping the headline and
      // sub-copy. Read live so it tracks scroll and resize.
      const half = AVATAR_SIZE_PX / 2;
      const section = avatar.closest("section");
      let containment: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
      } | null = null;
      if (section) {
        const sRect = section.getBoundingClientRect();
        containment = {
          minX: sRect.left + CONTAINMENT_PADDING_X_PX + half,
          maxX: sRect.right - CONTAINMENT_PADDING_X_PX - half,
          minY: sRect.top + CONTAINMENT_PADDING_TOP_PX + half,
          maxY: sRect.bottom - CONTAINMENT_PADDING_BOTTOM_PX - half,
        };
      }

      // Unit vector away from the cursor.
      let dx = currentCenter.x - cursorX;
      let dy = currentCenter.y - cursorY;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.001) {
        // Cursor sitting exactly on the avatar center; pick a random direction.
        const a = Math.random() * Math.PI * 2;
        dx = Math.cos(a);
        dy = Math.sin(a);
      } else {
        dx /= dist;
        dy /= dist;
      }

      // Random angle jitter so the dodge isn't perfectly predictable.
      const variation =
        (Math.random() - 0.5) *
        2 *
        ((DODGE_ANGLE_VARIATION_DEG * Math.PI) / 180);
      const cosA = Math.cos(variation);
      const sinA = Math.sin(variation);
      let dirX = dx * cosA - dy * sinA;
      let dirY = dx * sinA + dy * cosA;

      // Edge-aware center bias: blend the direction toward the containment
      // center proportional to how close we are to an edge. Keeps the avatar
      // from repeatedly slamming the same wall.
      if (containment) {
        const cx = (containment.minX + containment.maxX) / 2;
        const cy = (containment.minY + containment.maxY) / 2;
        const halfW = (containment.maxX - containment.minX) / 2;
        const halfH = (containment.maxY - containment.minY) / 2;
        const ex = halfW > 0 ? Math.abs(currentCenter.x - cx) / halfW : 0;
        const ey = halfH > 0 ? Math.abs(currentCenter.y - cy) / halfH : 0;
        const edgeNearness = Math.min(1, Math.max(ex, ey));
        const blend = edgeNearness * DODGE_EDGE_BIAS_MAX;
        if (blend > 0) {
          const tcx = cx - currentCenter.x;
          const tcy = cy - currentCenter.y;
          const tcMag = Math.hypot(tcx, tcy);
          if (tcMag > 0.001) {
            const tcnX = tcx / tcMag;
            const tcnY = tcy / tcMag;
            dirX = dirX * (1 - blend) + tcnX * blend;
            dirY = dirY * (1 - blend) + tcnY * blend;
            const fMag = Math.hypot(dirX, dirY);
            if (fMag > 0.001) {
              dirX /= fMag;
              dirY /= fMag;
            }
          }
        }
      }

      // Screen-space target, then clamp to containment so the avatar's full
      // box stays inside the allowed band.
      let targetScreenX = currentCenter.x + dirX * DODGE_DISTANCE_PX;
      let targetScreenY = currentCenter.y + dirY * DODGE_DISTANCE_PX;
      if (containment) {
        targetScreenX = Math.min(
          Math.max(targetScreenX, containment.minX),
          containment.maxX,
        );
        targetScreenY = Math.min(
          Math.max(targetScreenY, containment.minY),
          containment.maxY,
        );
      }

      // Convert screen-space target to an offset from home. This offset is
      // what the motion values animate to; the wrapper's transform translates
      // by that offset so the screen-space target lands where we want it.
      const targetOffsetX = targetScreenX - homeScreen.x;
      const targetOffsetY = targetScreenY - homeScreen.y;

      stopActive();
      setMode("dodging");
      const myGen = animationGenRef.current;

      const xCtl = animate(xMv, targetOffsetX, {
        duration: DODGE_DURATION_S,
        ease: "easeOut",
      });
      const yCtl = animate(yMv, targetOffsetY, {
        duration: DODGE_DURATION_S,
        ease: "easeOut",
      });
      activeAnimationsRef.current = [xCtl, yCtl];

      Promise.all([xCtl, yCtl]).then(() => {
        if (myGen !== animationGenRef.current) return;
        // Dodge finished naturally; sit here. Mode stays "dodging" until the
        // idle timer fires the return-home transition.
        activeAnimationsRef.current = [];
      });
    };

    /* -- 7th trigger: concede. Glide home, show win message, end the game. -- */
    const triggerConcede = () => {
      stopActive();
      setMode("returning");
      // Lock the game out IMMEDIATELY so any further pointermoves take the
      // post-game branch instead of arming the idle timer or triggering dodges.
      gameOverRef.current = true;
      winMessageActiveRef.current = true;
      clearIdleTimer();

      setBubbleCopy(WIN_MESSAGE_COPY);

      // The win message persists through the glide home and continues to sit
      // afterward, for a total of WIN_MESSAGE_DURATION_MS counted from now.
      clearWinMessageTimer();
      winMessageTimeoutRef.current = setTimeout(() => {
        winMessageTimeoutRef.current = null;
        winMessageActiveRef.current = false;
        // Bubble vanishes; does NOT revert to "touch me". The next post-game
        // pointermove will optionally surface the post-game hover line.
        setBubbleCopy(null);
      }, WIN_MESSAGE_DURATION_MS);

      // Same return motion as idle-return (easeOut over RETURN_DURATION_S).
      const myGen = animationGenRef.current;
      const xCtl = animate(xMv, HOME_POSITION.x, {
        duration: RETURN_DURATION_S,
        ease: "easeOut",
      });
      const yCtl = animate(yMv, HOME_POSITION.y, {
        duration: RETURN_DURATION_S,
        ease: "easeOut",
      });
      activeAnimationsRef.current = [xCtl, yCtl];

      Promise.all([xCtl, yCtl]).then(() => {
        if (myGen !== animationGenRef.current) return;
        activeAnimationsRef.current = [];
        // Game is over. Do NOT restart the float. Do NOT reset the counter.
        // The avatar simply rests at home for the remainder of the session.
      });
    };

    /* -- Entry point for every in-proximity trigger. Decides dodge vs concede. -- */
    const triggerDodge = (cursorX: number, cursorY: number) => {
      const nextCount = dodgeCountRef.current + 1;
      dodgeCountRef.current = nextCount;

      if (nextCount >= MAX_DODGES) {
        // 7th (or later) trigger: no escape. The catch ends the game.
        triggerConcede();
        return;
      }

      // Triggers 1 through MAX_DODGES - 1: show the escalating copy and dodge.
      setBubbleCopy(DODGE_COPY[nextCount - 1] ?? RESTING_BUBBLE_COPY);
      performDodgeMotion(cursorX, cursorY);
    };

    /* -- Idle-return: user stopped chasing before reaching MAX_DODGES.
     *    Glides home, resets the counter so the game is replayable, and
     *    resumes the Phase 1 float. */
    const triggerIdleReturn = () => {
      stopActive();
      setMode("returning");
      // The bubble keeps showing the last dodge copy through the glide.

      const myGen = animationGenRef.current;
      const xCtl = animate(xMv, HOME_POSITION.x, {
        duration: RETURN_DURATION_S,
        ease: "easeOut",
      });
      const yCtl = animate(yMv, HOME_POSITION.y, {
        duration: RETURN_DURATION_S,
        ease: "easeOut",
      });
      activeAnimationsRef.current = [xCtl, yCtl];

      Promise.all([xCtl, yCtl]).then(() => {
        if (myGen !== animationGenRef.current) return;
        activeAnimationsRef.current = [];
        // Idle-return ONLY: a clean rest resets the counter so the user can
        // play the dodge game again from the start. Critically, the 7th-catch
        // return goes through triggerConcede() and never reaches this branch,
        // so the game-over state is preserved.
        dodgeCountRef.current = 0;
        setBubbleCopy(RESTING_BUBBLE_COPY);
        startFloat();
      });
    };

    const armIdleTimer = () => {
      if (idleTimeoutRef.current !== null) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(() => {
        idleTimeoutRef.current = null;
        triggerIdleReturn();
      }, IDLE_RETURN_MS);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Proximity is measured against the avatar's live screen rect, not the
      // home position, so dodge-and-chase math stays correct mid-animation.
      const avatar = avatarRef.current;
      if (!avatar) return;
      const rect = avatar.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const ddx = event.clientX - cx;
      const ddy = event.clientY - cy;
      const inProximity =
        ddx * ddx + ddy * ddy < PROXIMITY_RADIUS_PX * PROXIMITY_RADIUS_PX;

      // ---- Post-game branch ----
      // After the 7th catch, the avatar no longer moves. The bubble is the
      // only reactive surface.
      if (gameOverRef.current) {
        // During the win-message window, the win line is locked in and must
        // not be replaced by the post-game hover line.
        if (winMessageActiveRef.current) return;
        setBubbleCopy(inProximity ? POST_GAME_HOVER_COPY : null);
        return;
      }

      // ---- In-game branch ----
      if (!inProximity) return;

      // In proximity: reset the idle timer regardless of mode so continuous
      // chasing keeps the avatar in dodge mode.
      armIdleTimer();

      const now = performance.now();
      const sinceLast = now - lastDodgeAtRef.current;
      const mode = modeRef.current;

      // Trigger a new dodge whenever we're not already mid-dodge (or the
      // cooldown has elapsed during a chase). Returning-home is interruptible
      // by proximity: a returning avatar can be chased again.
      const canDodge =
        mode === "floating" ||
        mode === "returning" ||
        (mode === "dodging" && sinceLast >= DODGE_COOLDOWN_MS);

      if (canDodge) {
        lastDodgeAtRef.current = now;
        triggerDodge(event.clientX, event.clientY);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      clearIdleTimer();
      clearWinMessageTimer();
      // Animation lifecycle is owned by the Phase 1 effect's cleanup; both
      // effects share the same dependency set, so they unmount together.
    };
  }, [
    shouldReduceMotion,
    startFloat,
    stopActive,
    clearIdleTimer,
    clearWinMessageTimer,
    setMode,
    xMv,
    yMv,
  ]);

  return (
    <motion.div
      style={{ x: xMv, y: yMv }}
      className="relative inline-flex shrink-0"
    >
      <div
        ref={avatarRef}
        className="shrink-0 overflow-hidden rounded-full"
        style={{
          width: `${AVATAR_SIZE_PX}px`,
          height: `${AVATAR_SIZE_PX}px`,
          willChange: shouldReduceMotion ? undefined : "transform",
        }}
      >
        <Image
          src="/profilepicture.png"
          alt="Portrait of Cyril Stephen"
          width={AVATAR_SIZE_PX}
          height={AVATAR_SIZE_PX}
          priority
          className="rounded-full object-cover"
          style={{ width: AVATAR_SIZE_PX, height: AVATAR_SIZE_PX }}
        />
      </div>
      {bubbleCopy !== null && (
        // Speech bubble (Figma node 602:546931). Positioned above the avatar,
        // horizontally centered, with the tail tip 4px above the avatar's top
        // edge. Absolute + pointer-events-none so it never shifts layout or
        // interferes with proximity detection. Sits inside the motion group,
        // so it moves with the avatar. The downward tail is a CSS border
        // triangle (the Figma asset is a temporary remote URL, and a triangle
        // is trivial to recreate in the forest token color).
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full left-1/2 mb-[length:var(--size-4)] flex -translate-x-1/2 flex-col items-center"
        >
          {/* w-max + whitespace-nowrap keeps every copy line on one row;
              the bubble grows as wide as the text needs. No max-width cap so
              nothing ever wraps. */}
          <div className="flex w-max items-center justify-center rounded-[12px] bg-[color:var(--color-forest)] px-[length:var(--padding-small)] py-[length:var(--size-12)]">
            <p className="m-0 whitespace-nowrap font-[family-name:var(--font-inter)] text-[12px] font-medium leading-[16px] text-[color:var(--color-sand-25)]">
              {bubbleCopy}
            </p>
          </div>
          <div className="-mt-px h-0 w-0 border-x-[8px] border-t-[9px] border-x-transparent border-t-[color:var(--color-forest)]" />
        </div>
      )}
    </motion.div>
  );
}
