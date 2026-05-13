"use client";

import { usePathname } from "next/navigation";
import { SiteNavbar } from "@/src/components/SiteNavbar";

function isCaseStudyRoute(pathname: string): boolean {
  return /^\/work\/[^/]+$/.test(pathname);
}

export function NavbarGate() {
  const pathname = usePathname();

  if (isCaseStudyRoute(pathname)) {
    return null;
  }

  return <SiteNavbar />;
}
