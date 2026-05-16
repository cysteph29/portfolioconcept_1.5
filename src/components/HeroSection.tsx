import Image from "next/image";
// import { SpinningCoin } from "@/src/components/SpinningCoin";

const HERO_COPY = "I obsess over what to build, and then design it well.";

export function HeroSection() {
  return (
    <section
      aria-label="Introduction"
      className="flex w-full flex-col items-center gap-[length:var(--size-32)] px-[length:var(--page-gutter-fluid)] pb-[length:var(--size-40)]"
    >
      {/* <SpinningCoin
        frontImage="/profilepicture.png"
        size={152}
        coinThickness={0.2}
      /> */}
      <div className="shrink-0 overflow-hidden rounded-full">
        <Image
          src="/profilepicture.png"
          alt="Portrait of Cyril Stephen"
          width={152}
          height={152}
          priority
          className="h-[152px] w-[152px] rounded-full object-cover"
        />
      </div>
      <p
        className="hero-headline-measure text-center text-[96px] font-light leading-[96px] tracking-normal text-[color:var(--text-primary)]"
        style={{ fontFamily: "var(--font-roca)" }}
      >
        {HERO_COPY}
      </p>
    </section>
  );
}
