"use client";

import { useEffect, useRef, useState } from "react";

import { ExperienceSection } from "@/src/components/ExperienceSection";
import { FooterSection } from "@/src/components/FooterSection";
import { HeroSection } from "@/src/components/HeroSection";
import { Reveal } from "@/src/components/Reveal";
import { WorkSection } from "@/src/components/WorkSection";

export default function Home() {
  const footerHostRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const footerHost = footerHostRef.current;
    if (!footerHost) {
      return;
    }

    const measureFooter = () => {
      setFooterHeight(Math.ceil(footerHost.getBoundingClientRect().height));
    };

    measureFooter();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measureFooter);
      resizeObserver.observe(footerHost);
    }

    window.addEventListener("resize", measureFooter);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureFooter);
    };
  }, []);

  return (
    <div className="relative w-full bg-[color:var(--color-bark)]">
      <div className="fixed bottom-0 left-0 z-0 w-full">
        <div ref={footerHostRef} id="contact">
          <FooterSection />
        </div>
      </div>

      <main
        className="relative z-[1] flex w-full flex-col items-center rounded-b-[length:var(--radius-x-large)] bg-[color:var(--color-sand-100)] pb-[length:var(--size-48)] pt-[length:var(--size-40)] max-md:rounded-b-[length:var(--radius-mobile-x-large)]"
      >
        <Reveal className="w-full" variant="hero">
          <HeroSection />
        </Reveal>
        <Reveal variant="scroll" delay={0.5}>
          <section
            aria-label="Work"
            className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
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
          </section>
        </Reveal>
        <Reveal variant="scroll">
          <section
            aria-label="Experience"
            className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
          >
            <div className="mx-auto w-full max-w-[length:var(--measure-shell-rest)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-80)]">
              <ExperienceSection />
            </div>
          </section>
        </Reveal>
      </main>
      <div aria-hidden className="pointer-events-none w-full" style={{ height: `${footerHeight}px` }} />
    </div>
  );
}
