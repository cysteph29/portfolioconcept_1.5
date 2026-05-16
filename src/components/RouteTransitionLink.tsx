"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type RouteTransitionLinkProps = ComponentProps<typeof Link>;

export function RouteTransitionLink({ children, ...props }: RouteTransitionLinkProps) {
  return <Link {...props}>{children}</Link>;
}
