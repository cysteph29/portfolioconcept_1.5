import Image from "next/image";
import { getAllPublishedProjectFrontmatter } from "@/src/lib/content/projects";
import { RouteTransitionLink } from "@/src/components/RouteTransitionLink";

interface WorkSectionProps {
  title?: string;
  excludeSlug?: string;
  limit?: number;
}

const projectHighlights: Record<string, { stat: string; statDetail: string }> = {
  "salesforce-trailhead": {
    stat: "6 of 8",
    statDetail: "Power users preferred Solve over ChatGPT for Salesforce questions",
  },
  "axway-one": {
    stat: "67%",
    statDetail: "Reduction in invoice diagnosis time",
  },
  "the-ken": {
    stat: "5.6%",
    statDetail: "Lift in subscription conversions",
  },
};

export function WorkSection({
  title = "Work.",
  excludeSlug,
  limit,
}: WorkSectionProps) {
  const projects = getAllPublishedProjectFrontmatter()
    .filter((project) => project.slug !== excludeSlug)
    .slice(0, limit ?? Number.POSITIVE_INFINITY)
    .map((project) => ({
      ...project,
      href: `/work/${project.slug}`,
      stat: projectHighlights[project.slug]?.stat ?? project.year,
      statDetail: projectHighlights[project.slug]?.statDetail ?? project.summary,
    }));

  return (
    <div className="flex w-full flex-col items-center gap-[length:var(--size-48)]">
      <h2
        className="text-center text-[96px] font-light leading-[96px] tracking-normal text-[color:var(--text-primary)]"
        style={{ fontFamily: "var(--font-roca)" }}
      >
        {title}
      </h2>

      <div className="flex w-full flex-col items-center gap-[length:var(--size-32)]">
        {projects.map((project) => (
          <RouteTransitionLink
            key={project.title}
            href={project.href}
            className="project-transition-link work-card-measure block overflow-hidden rounded-[length:var(--radius-medium)] bg-[color:var(--color-sand-50)] text-[color:var(--text-primary)] no-underline"
          >
            <article>
              <div className="px-[length:var(--padding-large)] pt-[length:var(--padding-large)]">
                <div className="relative w-full overflow-hidden rounded-[length:var(--radius-medium)] aspect-[16/9]">
                  {project.coverVideo ? (
                    <video
                      className="h-full w-full object-cover object-center"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    >
                      <source src={project.coverVideo} />
                    </video>
                  ) : (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover object-center"
                      sizes="(min-width: 1280px) 1184px, calc(100vw - 64px)"
                    />
                  )}
                </div>
              </div>

              <div className="p-[length:var(--padding-large)]">
                <div className="grid w-full grid-cols-1 gap-[length:var(--size-16)] md:grid-cols-[minmax(0,65fr)_minmax(240px,35fr)] md:items-stretch md:gap-[length:var(--size-40)]">
                  <div className="min-w-0">
                    <h3
                      className="text-[36px] font-medium leading-[42px] text-[color:var(--text-primary)]"
                      style={{ fontFamily: "var(--font-gotham)" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="mt-[length:var(--size-12)] text-[24px] font-normal leading-[32px] text-[color:var(--text-primary)]"
                      style={{ fontFamily: "var(--font-gotham)" }}
                    >
                      {project.summary}
                    </p>
                  </div>

                  <div className="flex w-full flex-col justify-between rounded-[length:var(--radius-medium)] bg-[color:var(--color-sand-25)] p-[length:var(--padding-medium)] md:h-full">
                    <p
                      className="text-[48px] font-light leading-[56px] text-[color:var(--text-primary)]"
                      style={{ fontFamily: "var(--font-roca)" }}
                    >
                      {project.stat}
                    </p>
                    <p
                      className="text-[16px] font-medium leading-[20px] text-[color:var(--text-secondary)]"
                      style={{ fontFamily: "var(--font-gotham)" }}
                    >
                      {project.statDetail}
                    </p>
                  </div>
                </div>

                <div className="mt-[length:var(--size-40)] border-t border-dashed border-[color:var(--text-tertiary)] pt-[length:var(--size-40)]">
                  <div className="flex flex-row flex-wrap items-start gap-[length:var(--size-24)]">
                    <div className="flex w-max max-w-full flex-col">
                      <p
                        className="text-[16px] font-medium uppercase leading-[20px] tracking-[0.06em] text-[color:var(--text-secondary)]"
                        style={{ fontFamily: "var(--font-gotham)" }}
                      >
                        Timeline
                      </p>
                      <p
                        className="mt-[length:var(--size-8)] text-[24px] font-normal leading-[32px] text-[color:var(--text-primary)]"
                        style={{ fontFamily: "var(--font-gotham)" }}
                      >
                        {project.timeline}
                      </p>
                    </div>
                    <div className="flex w-max max-w-full flex-col">
                      <p
                        className="text-[16px] font-medium uppercase leading-[20px] tracking-[0.06em] text-[color:var(--text-secondary)]"
                        style={{ fontFamily: "var(--font-gotham)" }}
                      >
                        Role
                      </p>
                      <p
                        className="mt-[length:var(--size-8)] text-[24px] font-normal leading-[32px] text-[color:var(--text-primary)]"
                        style={{ fontFamily: "var(--font-gotham)" }}
                      >
                        {project.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RouteTransitionLink>
        ))}
      </div>
    </div>
  );
}
