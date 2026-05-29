"use client";

import { ExperienceSection } from "@/src/components/ExperienceSection";
import { FooterSection } from "@/src/components/FooterSection";
import { HeroSection } from "@/src/components/HeroSection";
import { WorkSection } from "@/src/components/WorkSection";
import { motion } from "motion/react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

function slide(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  };
}

export default function Home() {
  return (
    <main className="flex w-full flex-col items-center pb-[length:var(--size-40)] pt-[length:var(--size-40)]">
      <motion.div className="w-full" {...slide(0.4)}>
        <HeroSection />
      </motion.div>
      <motion.section
        aria-label="Work"
        className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
        {...slide(0.7)}
      >
        <div className="mx-auto w-full max-w-[length:var(--measure-shell-rest)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-80)]">
          <WorkSection
            coverVideoOverrides={{
              "salesforce-trailhead": "/case-study-assets/projectcard-trailhead-v1.mov",
              "axway-one": "/case-study-assets/projectcard-axway-v1.mov",
              "the-ken": "/case-study-assets/projectcard-ken-v1.mov",
            }}
          />
        </div>
      </motion.section>
      <motion.section
        aria-label="Experience"
        className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
        {...slide(0.9)}
      >
        <div className="mx-auto w-full max-w-[length:var(--measure-shell-rest)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-80)]">
          <ExperienceSection />
        </div>
      </motion.section>
      <motion.div id="contact" className="w-full" {...slide(1.1)}>
        <FooterSection />
      </motion.div>
    </main>
  );
}
