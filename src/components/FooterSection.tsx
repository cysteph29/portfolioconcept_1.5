import Image from "next/image";

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

export function FooterSection() {
  return (
    <footer aria-label="Footer" className="w-full overflow-hidden bg-[color:var(--color-bark)]">
      <div className="w-full px-[24px] py-[80px]">
        <div className="flex flex-col items-center gap-[24px]">
          <Image
            src="/profilepicture.png"
            alt=""
            width={80}
            height={80}
            className="h-[80px] w-[80px] rounded-full"
          />

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
