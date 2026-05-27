import Image from "next/image";
// import { SpinningCoin } from "@/src/components/SpinningCoin";

const HERO_HEADLINE =
  "I'm a product designer fascinated by people, and leverage that to build products worth using.";
const HERO_SUBCOPY =
  "I work fast, care about tiny details, and have an appetite for things I haven't tried before.";

export function HeroSection() {
  return (
    <section
      aria-label="Introduction"
      className="flex w-full flex-col items-center gap-[length:var(--size-32)] px-[length:var(--page-gutter-fluid)] pb-[length:var(--size-40)]"
    >
      {/* <SpinningCoin
        frontImage="/profilepicture.png"
        size={120}
        coinThickness={0.2}
      /> */}
      <div className="shrink-0 overflow-hidden rounded-full">
        <Image
          src="/profilepicture.png"
          alt="Portrait of Cyril Stephen"
          width={120}
          height={120}
          priority
          className="h-[120px] w-[120px] rounded-full object-cover"
        />
      </div>
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
