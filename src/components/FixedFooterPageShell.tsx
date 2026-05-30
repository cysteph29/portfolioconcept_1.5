"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FooterSection } from "@/src/components/FooterSection";

interface FixedFooterPageShellProps {
  children: ReactNode;
  mainClassName: string;
  footerId?: string;
}

export function FixedFooterPageShell({
  children,
  mainClassName,
  footerId,
}: FixedFooterPageShellProps) {
  const footerHostRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const footerHost = footerHostRef.current;
    if (!footerHost) return;

    const measureFooter = () => {
      setFooterHeight(Math.ceil(footerHost.getBoundingClientRect().height));
    };

    measureFooter();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measureFooter);
      resizeObserver.observe(footerHost);
    }

    window.addEventListener("resize", measureFooter);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureFooter);
    };
  }, []);

  return (
    <div className="relative w-full bg-[color:var(--color-bark)]">
      <div className="fixed bottom-0 left-0 z-0 w-full">
        <div ref={footerHostRef} id={footerId}>
          <FooterSection />
        </div>
      </div>

      <main className={mainClassName}>{children}</main>

      <div
        aria-hidden
        className="pointer-events-none w-full"
        style={{ height: `${footerHeight}px` }}
      />
    </div>
  );
}
