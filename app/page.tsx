import { ExperienceSection } from "@/src/components/ExperienceSection";
import { FooterSection } from "@/src/components/FooterSection";
import { HeroSection } from "@/src/components/HeroSection";
import { WorkSection } from "@/src/components/WorkSection";

export default function Home() {
  return (
    <main className="flex w-full flex-col items-center pb-[length:var(--size-40)] pt-[length:var(--size-40)]">
      <HeroSection />
      <section
        aria-label="Work"
        className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
      >
        <div className="mx-auto w-full max-w-[length:var(--measure-shell-rest)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-80)]">
          <WorkSection />
        </div>
      </section>
      <section
        aria-label="Experience"
        className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
      >
        <div className="mx-auto w-full max-w-[length:var(--measure-shell-rest)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-80)]">
          <ExperienceSection />
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
