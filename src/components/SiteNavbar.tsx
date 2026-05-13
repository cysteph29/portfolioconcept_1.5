import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/resume", label: "Resume" },
] as const;

const PROFILE_IMAGE_SIZE_PX = 56;

function NavLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      className="font-medium capitalize text-[color:var(--text-primary)] no-underline"
    >
      {children}
    </Link>
  );
}

export function SiteNavbar() {
  return (
    <header className="px-[length:var(--page-gutter-fluid)] pt-[length:var(--padding-large)]">
      <nav
        aria-label="Main"
        className="nav-measure flex items-center justify-between rounded-[length:var(--radius-2x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--size-24)] py-[length:var(--size-8)]"
      >
        <div className="flex shrink-0 items-center justify-center">
          <Image
            src="/profilepicture.png"
            alt="Profile"
            width={PROFILE_IMAGE_SIZE_PX}
            height={PROFILE_IMAGE_SIZE_PX}
            priority
            className="aspect-square h-[length:var(--size-56)] w-[length:var(--size-56)] rounded-full object-cover"
          />
        </div>
        <div className="flex items-center gap-[length:var(--size-24)]">
          {links.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
