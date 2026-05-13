const experiences = [
  {
    title: "Salesforce Trailhead",
    placeholderLabel: "SF",
    description:
      "Co-leading strategy and product design for Trailhead, identifying engagement opportunities to improve retention among power users post-milestone completion.",
    dates: "Aug 25' — May 26'",
  },
  {
    title: "Axway E-Invoicing",
    placeholderLabel: "AX",
    description:
      "Led end-to-end design from early discovery through hand-off as the sole designer for the 'e-Invoicing' compliance service, a regulated enterprise B2B FinTech product.",
    dates: "June 25' — Aug 25'",
  },
  {
    title: "The Ken (Via Chariot)",
    placeholderLabel: "TK",
    description:
      "Collaborated with C-suite, product, and engineering on growth, conversion, and retention projects for The Ken, a business news publication with 5M+ global readers and 25,000+ paid subscribers.",
    dates: "March 24' — July 24'",
  },
  {
    title: "Intentionally Designed Solutions",
    placeholderLabel: "IDS",
    description:
      "Delivered 0-to-1 product design, alongside brand and marketing design, for 3 interconnected products (a smart home device catalog, mobile app and CMS).",
    dates: "March 24' — July 24'",
  },
  {
    title: "Marketing Design",
    placeholderLabel: "IU",
    description:
      "Brand and marketing design for digital and print touchpoints, campaign visuals, and stakeholder-facing materials.",
    dates: "March 24' — July 24'",
  },
] as const;

function LogoPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[color:var(--color-sand-100)] text-[11px] font-medium uppercase tracking-[0.04em] text-[color:var(--text-secondary)]"
      aria-hidden
    >
      {label}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <div className="flex w-full flex-col items-center gap-[length:var(--size-48)]">
      <h2
        className="text-center text-[96px] font-light leading-[96px] tracking-normal text-[color:var(--text-primary)]"
        style={{ fontFamily: "var(--font-roca)" }}
      >
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
                  <LogoPlaceholder label={item.placeholderLabel} />
                  <div className="flex min-w-0 flex-1 flex-col gap-[length:var(--size-8)]">
                    <h3
                      className="text-[36px] font-medium leading-[42px] text-[color:var(--text-primary)]"
                      style={{ fontFamily: "var(--font-gotham)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[24px] font-normal leading-[32px] text-[color:var(--text-primary)]"
                      style={{ fontFamily: "var(--font-gotham)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                <p
                  className="shrink-0 text-[16px] font-medium leading-[20px] text-[color:var(--text-secondary)]"
                  style={{ fontFamily: "var(--font-gotham)" }}
                >
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
