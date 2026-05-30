import Image from "next/image";
import type { CSSProperties } from "react";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cyril-stephen/",
    icon: "/linkedin.png",
  },
  {
    label: "X",
    href: "https://x.com/cyril_design",
    icon: "/twitter.png",
  },
  {
    label: "Medium",
    href: "https://medium.com/@cyril_design",
    icon: "/medium.png",
  },
] as const;

const FOOTER_RING_SPIN_DURATION = "24s";

export function FooterSection() {
  return (
    <footer aria-label="Footer" className="w-full overflow-hidden bg-[color:var(--color-bark)]">
      <div className="w-full px-[24px] py-[80px]">
        <div className="flex flex-col items-center gap-[24px]">
          <div
            aria-hidden
            className="relative h-[120px] w-[120px]"
            style={{ "--footer-emblem-spin-duration": FOOTER_RING_SPIN_DURATION } as CSSProperties}
          >
            <Image
              src="/footer-ring.png"
              alt=""
              fill
              sizes="120px"
              className="footer-emblem-ring absolute inset-0 h-full w-full object-contain"
            />
            <Image
              src="/footer-boot.png"
              alt=""
              fill
              sizes="120px"
              className="absolute inset-0 z-[1] h-full w-full object-contain"
            />
          </div>

          <h2 className="type-h1 text-center text-[color:var(--color-sand-25)]">
            cyrilstephenhere@gmail.com
          </h2>

          <div className="flex items-center gap-[length:var(--size-12)]">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="block rounded-full"
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-[56px] w-[56px] rounded-full"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
