"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useRouteTransition } from "@/src/components/PageTransition";

/**
 * Close ("×") control for a case study. Plays the case study exit animation
 * (drop + fade) and then routes home with a "to-home" intent so the homepage
 * scales back in. Rendered as a real link so it stays keyboard reachable and
 * works with modified clicks; the entrance animation never blocks it.
 */
export function CaseStudyCloseButton() {
  const { navigate } = useRouteTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate("/", "to-home");
  };

  return (
    <Link
      href="/"
      aria-label="Close case study and return home"
      className="case-study-hero-close"
      onClick={handleClick}
    >
      ×
    </Link>
  );
}
