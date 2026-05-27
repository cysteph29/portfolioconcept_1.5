import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { FooterSection } from "@/src/components/FooterSection";
import { CaseStudySectionDivider } from "@/src/components/case-study/CaseStudyLayout";

const ABOUT_TITLE = "Hi, Cyril here";

const ABOUT_SECTIONS: { heading: string; body: ReactNode }[] = [
  {
    heading:
      "Values I live by, despite falling short of them from time-to-time",
    body: (
      <p>
        <span className="underline">
          Uncommon Care: Good enough isn&apos;t good enough
        </span>
        <br />
        I aim everything I produce to be the best version of itself. This
        applies to my design work, when I perform music, and everything else I
        put my name on.
        <br />
        <br />
        <span className="underline">
          Communication: The highest-leverage skill
        </span>
        <br />
        What I say matters. How I say it matters more. I am intentional about
        both.
        <br />
        <br />
        <span className="underline">
          Connection: The right people make life richer
        </span>
        <br />
        I find the right relationships making my life infinitely more
        fulfilling. The quality of my life is a direct reflection of the
        quality of the people I surround myself with.
        <br />
        <br />
        <span className="underline">
          Conviction: Committed, but never closed
        </span>
        <br />
        I commit fully to what I believe in, but that doesn&apos;t mean I&apos;m
        closed off. Conviction and openness are not opposites to me.
        <br />
        <br />
        <span className="underline">
          Growth: Always seeking, never settled
        </span>
        <br />
        I am my own harshest critic, and I deliberately seek out what to work on
        next.
      </p>
    ),
  },
  {
    heading: "How’d I end up in design?",
    body: (
      <p>
        Circumstance &amp; curiosity.
        <br />
        <br />
        As a musician &amp; audio engineer, design was never really in my radar.
        <br />
        <br />
        It started when I was forced to make a portfolio website during my time
        as a freelance audio engineer.
        <br />
        <br />
        I enjoyed the process of having control over how I present myself on the
        web.
        <br />
        <br />
        My friends hyped up my web design skills (little did I know they just
        wanted someone to make their portfolio websites for them), making me
        believe that I could get good at this if I work on it.
        <br />
        <br />
        So I started teaching myself web design, and eventually discovered
        product design.
        <br />
        <br />
        I quickly recognized my need for accountability and mentorship, leading
        to getting my very first bootcamp from 10kdesigners.
        <br />
        <br />
        I slowly chipped away at my skills over time, and eventually landed my
        first product design gig from this tweet.
      </p>
    ),
  },
  {
    heading: "What I've learned working as a designer",
    body: (
      <p>
        My first design job taught me how to embrace the uncertainty of working
        on something that hasn&apos;t fully taken a form yet.
        <br />
        <br />
        My second job taught me the importance of speed, execution, and craft.
        <br />
        <br />
        My last role taught me how to work in bigger teams, where collaboration
        and communication dictates success.
        <br />
        <br />
        And what was common in all these roles?
        <br />
        <br />
        Empathy.
        <br />
        <br />
        Empathy not only for those who use my product and their goals, but also
        for the people I work with, and the organization that believed in me.
      </p>
    ),
  },
  {
    heading: "What do I do when I’m not designing?",
    body: (
      <p>
        <span className="underline">
          Music: Performing, listening, and breaking down songs
        </span>
        <br />
        Having been trained classically, played in pop &amp; rock bands, and
        even having composed music for theatre, music has been and will continue
        to be a huge part of my life. I perform, listen to albums, and break
        down songs that catch my attention.
        <br />
        <br />
        <span className="underline">Fashion: An unexpected interest</span>
        <br />
        As someone who used to wear black t-shirts 7x/week, I honesly never saw
        this coming. I was introduced to the world of fashion by a good friend
        of mine, and now find myself constantly on the lookout for new pieces,
        putting together odd combinations and wondering why certain things work
        for some but not for others.
        <br />
        <br />
        <span className="underline">
          Reading: From self-improvement onto classical literature
        </span>
        <br />
        Younger me loathed at the idea of &apos;wasting&apos; my time reading
        literature and instead something productive like
        &apos;self-improvement&apos;. I thankfully got over this phase and take
        the time to enjoy some classics. My last read was The Remains of the
        Day.
        <br />
        <br />
        <span className="underline">
          Exploring humanity: I can be very social
        </span>
        <br />
        I love meeting new people, introducing people to each other and
        creating a social bubble of love. I&apos;m always looking to attend the
        next social event, and I find it to be extremely fulfilling.
      </p>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="flex w-full flex-col items-center pb-[length:var(--size-40)] pt-[length:var(--size-40)]">
      <section
        aria-label="About introduction"
        className="flex w-full flex-col items-center gap-[length:var(--size-32)] px-[length:var(--page-gutter-fluid)] pb-[length:var(--size-40)]"
      >
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

        <h1
          className="hero-headline-measure text-center text-[96px] font-light leading-[96px] tracking-normal text-[color:var(--text-primary)]"
          style={{ fontFamily: "var(--font-roca)" }}
        >
          {ABOUT_TITLE}
        </h1>
      </section>

      <section aria-label="About" className="w-full px-[length:var(--page-gutter-fluid)]">
        <div className="case-study-shell flex flex-col items-center">
          <div className="flex w-full flex-col">
            {ABOUT_SECTIONS.map((section, index) => (
              <Fragment key={section.heading}>
                <section
                  className="case-study-prose-section"
                  aria-label={section.heading}
                >
                  <div className="case-study-prose">
                    <div className="case-study-prose-header">
                      <h2 className="case-study-section-heading">
                        {section.heading}
                      </h2>
                    </div>
                    <div className="case-study-prose-content">
                      {section.body}
                    </div>
                  </div>
                </section>
                {index < ABOUT_SECTIONS.length - 1 ? (
                  <CaseStudySectionDivider />
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
