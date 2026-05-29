"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useRouteTransition } from "@/src/components/PageTransition";

type RouteTransitionLinkProps = ComponentProps<typeof Link>;

/**
 * Links to a case study. Instead of navigating immediately it plays the current
 * route's exit animation, then navigates with a "to-case" intent so the case
 * study rises in on mount. Falls back to the default Link behavior for modified
 * clicks (new tab, etc.) and under reduced motion (handled inside `navigate`).
 */
export function RouteTransitionLink({
  children,
  onClick,
  href,
  ...props
}: RouteTransitionLinkProps) {
  const { navigate } = useRouteTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    // Signal the custom cursor to reset before the exit animation begins.
    window.dispatchEvent(new CustomEvent("routetransitionstart"));
    navigate(typeof href === "string" ? href : href.toString(), "to-case");
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
