import Image from "next/image";

const experiences = [
  {
    title: "Salesforce Trailhead",
    logoSrc: "/logo-saleforce.svg",
    description:
      "Co-leading strategy and product design for Trailhead, identifying engagement opportunities to improve retention among power users post-milestone completion.",
    dates: "August 25' — May 26'",
  },
  {
    title: "Axway E-Invoicing",
    logoSrc: "/logo-axway.svg",
    description:
      "Led end-to-end design from early discovery through hand-off as the sole designer for the 'e-Invoicing' compliance service, a regulated enterprise B2B FinTech product.",
    dates: "June 25' — August 25'",
  },
  {
    title: "The Ken (Via Chariot)",
    logoSrc: "/logo-theken.svg",
    description:
      "Collaborated with C-suite, product, and engineering on growth, conversion, and retention projects for The Ken, a business news publication with 5M+ global readers and 25,000+ paid subscribers.",
    dates: "March 23' — December 23'",
  },
  {
    title: "Intentionally Designed Solutions",
    logoSrc: "/logo-ids.svg",
    description:
      "Delivered 0-to-1 product design, alongside brand and marketing design, for 3 interconnected products (a smart home device catalog, mobile app and CMS).",
    dates: "March 24' — July 24'",
  },
  {
    title: "Indiana University",
    logoSrc: "/logo-iu.svg",
    description:
      "Brand and marketing design for digital and print touchpoints, campaign visuals, and stakeholder-facing materials.",
    dates: "February 25' - Present",
  },
] as const;

function ExperienceLogo({ src }: { src: string }) {
  return (
    <div
      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[color:var(--color-sand-100)]"
      aria-hidden
    >
      <Image src={src} alt="" width={40} height={40} className="h-[40px] w-[40px]" />
    </div>
  );
}

export function ExperienceSection() {
  return (
    <div className="flex w-full flex-col items-center gap-[length:var(--size-48)]">
      <h2 className="type-h1 text-center text-[color:var(--text-primary)]">
        Experience.
      </h2>

      <div className="flex w-full max-w-[length:var(--measure-work-card)] flex-col">
        {experiences.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === experiences.length - 1;
          const rowPadding = [
            !isFirst &&
              "border-t border-dashed border-[color:var(--text-tertiary)] pt-[length:var(--padding-large)]",
            (isFirst || (!isFirst && !isLast)) && "pb-[length:var(--padding-large)]",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={item.title} className={rowPadding || undefined}>
              <div className="flex flex-wrap items-start justify-between gap-x-[length:var(--size-24)] gap-y-[length:var(--size-8)]">
                <div className="flex min-w-0 flex-1 items-start gap-[length:var(--size-24)]">
                  <ExperienceLogo src={item.logoSrc} />
                  <div className="flex min-w-0 flex-1 flex-col gap-[length:var(--size-8)]">
                    <h3 className="type-h2 text-[color:var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="type-p1 w-full self-start text-[color:var(--text-secondary)] md:w-[80%] md:max-w-[80%]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <p className="type-h4 shrink-0 text-[color:var(--text-secondary)]">
                  {item.dates}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
