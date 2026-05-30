import { CoinEmblem } from "./CoinEmblem";

const HERO_HEADLINE =
  "I'm a product designer fascinated by people, and leverage that to build products worth using.";
const HERO_SUBCOPY =
  "I work fast, care about tiny details, and have an appetite for things I haven't tried before.";

export function HeroSection() {
  return (
    <section
      aria-label="Introduction"
      className="flex w-full flex-col items-center gap-[length:var(--size-16)] px-[length:var(--page-gutter-fluid)] pb-[length:var(--size-40)]"
    >
      <CoinEmblem
        ringSrc="/footer-ring.png"
        centerSrc="/header-face.png"
        size={104}
        centerAlt="Portrait of Cyril Stephen"
        priority
      />
      <div className="hero-headline-measure flex w-full flex-col items-center gap-[length:var(--size-16)]">
        <p className="type-h1 text-center text-[color:var(--text-primary)]">
          {HERO_HEADLINE}
        </p>
        <p className="type-p1 text-center text-[color:var(--text-secondary)]">
          {HERO_SUBCOPY}
        </p>
      </div>
    </section>
  );
}
