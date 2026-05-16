import Image from "next/image";
import Link from "next/link";

const RESUME_URL =
  "https://drive.google.com/file/d/18dNycBZWrscigoMgSD6L-0RqJRgyuSF6/view?usp=sharing";

const links: { href: string; label: string; external?: boolean }[] = [
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: RESUME_URL, label: "Resume", external: true },
];

const PROFILE_IMAGE_SIZE_PX = 56;

function NavLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
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
        <Link
          href="/"
          aria-label="Go to homepage"
          className="flex shrink-0 items-center justify-center rounded-full no-underline"
        >
          <Image
            src="/profilepicture.png"
            alt=""
            width={PROFILE_IMAGE_SIZE_PX}
            height={PROFILE_IMAGE_SIZE_PX}
            priority
            className="aspect-square h-[length:var(--size-56)] w-[length:var(--size-56)] rounded-full object-cover"
          />
        </Link>
        <div className="flex items-center gap-[length:var(--size-24)]">
          {links.map((item) => (
            <NavLink key={item.href} href={item.href} external={item.external}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
