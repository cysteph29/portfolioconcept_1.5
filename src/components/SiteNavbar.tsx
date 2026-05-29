"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RESUME_URL =
  "https://drive.google.com/file/d/18dNycBZWrscigoMgSD6L-0RqJRgyuSF6/view?usp=sharing";

const links: { href: string; label: string; external?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: RESUME_URL, label: "Resume", external: true },
];

function NavLink({
  href,
  external,
  isActive,
  children,
}: {
  href: string;
  external?: boolean;
  isActive?: boolean;
  children: string;
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-[length:var(--radius-large)] px-[length:var(--size-16)] py-[length:var(--size-12)] text-[20px] leading-[24px] font-medium capitalize text-[color:var(--text-primary)] no-underline transition-colors duration-150";
  const stateClasses = isActive
    ? "bg-[color:var(--color-sunlight)]"
    : "bg-transparent hover:bg-[color:var(--color-sand-100)]";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-current={isActive ? "page" : undefined}
      className={`${baseClasses} ${stateClasses}`}
    >
      {children}
    </Link>
  );
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isHiddenRef = useRef(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      const nextReducedMotion = mediaQuery.matches;
      setReducedMotion(nextReducedMotion);
      if (nextReducedMotion) {
        isHiddenRef.current = false;
        setIsHidden(false);
      }
    };

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    const TOP_REVEAL_SCROLL_PX = 24;
    const HIDE_AFTER_SCROLL_PX = 96;
    const DIRECTION_NOISE_THRESHOLD_PX = 6;

    const setHiddenState = (nextHidden: boolean) => {
      if (isHiddenRef.current === nextHidden) {
        return;
      }
      isHiddenRef.current = nextHidden;
      setIsHidden(nextHidden);
    };

    const handleScroll = () => {
      if (reducedMotion) {
        setHiddenState(false);
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= TOP_REVEAL_SCROLL_PX) {
        setHiddenState(false);
      } else if (Math.abs(delta) >= DIRECTION_NOISE_THRESHOLD_PX) {
        if (delta > 0 && currentScrollY > HIDE_AFTER_SCROLL_PX) {
          setHiddenState(true);
        } else if (delta < 0) {
          setHiddenState(false);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reducedMotion]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 px-[length:var(--page-gutter-fluid)] pt-[length:var(--padding-large)] transition-[transform,opacity] duration-300 ${
        reducedMotion ? "" : isHidden ? "ease-in" : "ease-out"
      }`}
      style={{
        transform: reducedMotion || !isHidden ? "translateY(0)" : "translateY(-100%)",
        opacity: reducedMotion || !isHidden ? 1 : 0,
        pointerEvents: isHidden ? "none" : "auto",
        transitionDuration: reducedMotion ? "0ms" : undefined,
      }}
    >
      <nav
        aria-label="Main"
        className="nav-measure flex items-center justify-center rounded-[length:var(--radius-2x-large)] px-[length:var(--size-24)] py-[length:var(--size-12)]"
        style={{
          backgroundColor: "rgb(255 255 255 / 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center">
          {links.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              external={item.external}
              isActive={
                (item.href === "/" && pathname === "/") ||
                (item.href === "/about" && pathname === "/about")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
