"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    "inline-flex items-center justify-center rounded-[length:var(--radius-large)] px-[length:var(--size-16)] py-[length:var(--size-8)] text-[20px] leading-[24px] font-medium capitalize text-[color:var(--text-primary)] no-underline transition-colors duration-150";
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

  return (
    <header className="px-[length:var(--page-gutter-fluid)] pt-[length:var(--padding-large)]">
      <nav
        aria-label="Main"
        className="nav-measure flex items-center justify-center rounded-[length:var(--radius-2x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--size-24)] py-[length:var(--size-8)]"
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
