import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FooterSection } from "@/src/components/FooterSection";
import { WorkSection } from "@/src/components/WorkSection";
import { CoverVideo } from "@/src/components/case-study/CoverVideo";
import { RevealOnScroll } from "@/src/components/case-study/RevealOnScroll";

export interface CaseStudyMetric {
  value: string;
  label: string;
}

interface CaseStudyLayoutProps {
  title: string;
  slug: string;
  coverImage?: string;
  coverVideo?: string;
  metrics?: CaseStudyMetric[];
  children: ReactNode;
}

export function CaseStudyLayout({
  title,
  slug,
  coverImage,
  coverVideo,
  metrics = [],
  children,
}: CaseStudyLayoutProps) {
  return (
    <main className="case-study-page-entry flex w-full flex-col items-center pb-[length:var(--size-56)] pt-[length:var(--page-gutter-fluid)]">
      <section className="case-study-hero-outer">
        <header className="case-study-header">
          <div className="case-study-hero-wrap">
            <div className="case-study-hero">
              <Link
                href="/"
                aria-label="Close case study and return home"
                className="case-study-hero-close"
              >
                ×
              </Link>

              <div className="case-study-hero-content">
                <div className="case-study-hero-copy-measure">
                  <h1 className="case-study-title">{title}</h1>
                </div>
              </div>

              {coverVideo ? (
                <div className="case-study-hero-media">
                  <div className="case-study-cover">
                    <CoverVideo src={coverVideo} />
                  </div>
                </div>
              ) : null}

              {!coverVideo && coverImage ? (
                <div className="case-study-hero-media">
                  <div className="case-study-cover">
                    <Image
                      src={coverImage}
                      alt={`${title} cover visual`}
                      width={1280}
                      height={800}
                      className="case-study-cover-image"
                      sizes="(min-width: 832px) 800px, calc(100vw - 32px)"
                      priority
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>
      </section>

      <section className="w-full px-[length:var(--page-gutter-fluid)]">
        <article
          className="case-study-shell"
          style={{ backgroundColor: "transparent", borderRadius: 0 }}
        >
          {metrics.length > 0 ? (
            <RevealOnScroll className="case-study-scroll-reveal">
              <CaseStudyMetricStrip metrics={metrics} />
            </RevealOnScroll>
          ) : null}

          <div className="case-study-body">{children}</div>
        </article>
      </section>

      <section
        aria-label="Other work"
        className="mt-[length:var(--size-40)] w-full px-[length:var(--page-gutter-fluid)]"
      >
        <RevealOnScroll className="case-study-scroll-reveal">
          <div className="mx-auto w-full max-w-[length:var(--measure-shell-rest)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-80)]">
            <WorkSection title="Other work" excludeSlug={slug} limit={2} />
          </div>
        </RevealOnScroll>
      </section>

      <RevealOnScroll className="case-study-scroll-reveal w-full">
        <FooterSection />
      </RevealOnScroll>
    </main>
  );
}

export function CaseStudySectionHeading({
  children,
}: {
  children: ReactNode;
}) {
  return <h2 className="case-study-section-heading">{children}</h2>;
}

/** Wraps one narrative block (problem / solution / outcome) in a semantic section with its own prose column. */
export function CaseStudyProseSection({
  "aria-label": ariaLabel,
  title,
  leadVisual,
  children,
}: {
  "aria-label": string;
  title: ReactNode;
  leadVisual?: { src: string; alt: string; width?: number; height?: number };
  children: ReactNode;
}) {
  const leadW = leadVisual?.width ?? 72;
  const leadH = leadVisual?.height ?? 72;

  return (
    <RevealOnScroll className="case-study-scroll-reveal">
      <section className="case-study-prose-section" aria-label={ariaLabel}>
        <div className="case-study-prose">
          <div className="case-study-prose-header">
            {leadVisual ? (
              <div
                className="case-study-section-lead-visual"
                style={{ width: leadW, height: leadH }}
              >
                <Image
                  src={leadVisual.src}
                  alt={leadVisual.alt}
                  width={leadW}
                  height={leadH}
                  className="case-study-section-lead-image"
                  sizes={`${leadW}px`}
                  style={{ width: leadW, height: leadH }}
                />
              </div>
            ) : null}
            <CaseStudySectionHeading>{title}</CaseStudySectionHeading>
          </div>
          <div className="case-study-prose-content">{children}</div>
        </div>
      </section>
    </RevealOnScroll>
  );
}

interface CaseStudyNarrativeSectionProps {
  title: ReactNode;
  children: ReactNode;
}

export function CaseStudyProblemSection({
  title,
  children,
}: CaseStudyNarrativeSectionProps) {
  return (
    <CaseStudyProseSection
      aria-label="Problem"
      title={title}
      leadVisual={{
        src: "/final_problem.svg",
        alt: "",
        width: 72,
        height: 72,
      }}
    >
      {children}
    </CaseStudyProseSection>
  );
}

export function CaseStudySolutionSection({
  title,
  children,
}: CaseStudyNarrativeSectionProps) {
  return (
    <CaseStudyProseSection
      aria-label="Solution"
      title={title}
      leadVisual={{
        src: "/final_solution.svg",
        alt: "",
        width: 72,
        height: 72,
      }}
    >
      {children}
    </CaseStudyProseSection>
  );
}

export function CaseStudyOutcomeSection({
  title,
  children,
}: CaseStudyNarrativeSectionProps) {
  return (
    <CaseStudyProseSection
      aria-label="Outcome"
      title={title}
      leadVisual={{
        src: "/final_outcome.svg",
        alt: "",
        width: 72,
        height: 72,
      }}
    >
      {children}
    </CaseStudyProseSection>
  );
}

export function CaseStudyFigure({
  src,
  alt,
  caption,
  solidBlue,
  videoSrc,
  videoPlaceholder,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  /** Filled rectangle using brand sky blue (`--color-sky`), no image. */
  solidBlue?: boolean;
  /** When set, renders a `<video>` element (otherwise falls back to image / placeholder). */
  videoSrc?: string;
  /** Dashed placeholder labeled for an upcoming prototype recording (no file yet). */
  videoPlaceholder?: boolean;
}) {
  let figureContent: ReactNode;

  if (solidBlue) {
    figureContent = (
      <>
        <div className="case-study-figure-solid" aria-hidden />
        {caption ? <figcaption className="type-p2">{caption}</figcaption> : null}
      </>
    );
  } else if (videoSrc) {
    figureContent = (
      <>
        <video
          className="case-study-figure-video"
          controls
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} />
        </video>
        {caption ? <figcaption className="type-p2">{caption}</figcaption> : null}
      </>
    );
  } else if (videoPlaceholder) {
    figureContent = (
      <>
        <div className="case-study-figure-placeholder">Prototype video</div>
        {caption ? <figcaption className="type-p2">{caption}</figcaption> : null}
      </>
    );
  } else if (!src) {
    figureContent = (
      <>
        <div className="case-study-figure-placeholder">Prototype / asset slot</div>
        {caption ? <figcaption className="type-p2">{caption}</figcaption> : null}
      </>
    );
  } else {
    figureContent = (
      <>
        <Image
          src={src}
          alt={alt ?? "Case study visual"}
          width={1200}
          height={760}
          className="case-study-figure-image"
          sizes="(min-width: 832px) 800px, calc(100vw - 32px)"
        />
        {caption ? <figcaption className="type-p2">{caption}</figcaption> : null}
      </>
    );
  }

  return (
    <RevealOnScroll className="case-study-scroll-reveal">
      <figure className="case-study-figure">{figureContent}</figure>
    </RevealOnScroll>
  );
}

export function CaseStudyMetricStrip({
  metrics,
}: {
  metrics: CaseStudyMetric[];
}) {
  return (
    <section className="case-study-metric-strip" aria-label="Project outcomes">
      {metrics.map((metric, index) => (
        <div
          key={`${metric.value}-${metric.label}-${index}`}
          className="case-study-metric-item"
        >
          <p className="case-study-metric-value">{metric.value}</p>
          <p className="case-study-metric-label">{metric.label}</p>
        </div>
      ))}
    </section>
  );
}

export function CaseStudyQuote({ children }: { children: ReactNode }) {
  return <blockquote className="case-study-quote">{children}</blockquote>;
}

export function InlineMetrics({ metrics }: { metrics: CaseStudyMetric[] }) {
  return (
    <RevealOnScroll className="case-study-scroll-reveal">
      <section className="case-study-inline-metrics" aria-label="Inline metrics">
        {metrics.map((metric, index) => (
          <div
            key={`${metric.value}-${metric.label}-${index}`}
            className="case-study-inline-metric-item"
          >
            <p className="case-study-inline-metric-value">{metric.value}</p>
            <p className="case-study-inline-metric-label">{metric.label}</p>
          </div>
        ))}
      </section>
    </RevealOnScroll>
  );
}

export function CaseStudySectionDivider() {
  return (
    <RevealOnScroll className="case-study-scroll-reveal">
      <div className="case-study-section-divider" aria-hidden="true">
        <p>~</p>
      </div>
    </RevealOnScroll>
  );
}
