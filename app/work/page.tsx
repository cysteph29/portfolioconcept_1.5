import { getAllPublishedProjectFrontmatter } from "@/src/lib/content/projects";
import { RouteTransitionLink } from "@/src/components/RouteTransitionLink";

export default function WorkPage() {
  const projects = getAllPublishedProjectFrontmatter();

  return (
    <main className="flex w-full flex-col items-center pb-[length:var(--size-56)] pt-[length:var(--size-40)]">
      <section className="w-full px-[length:var(--page-gutter-fluid)]">
        <div className="mx-auto flex w-full max-w-[length:var(--measure-shell-rest)] flex-col gap-[length:var(--size-32)] rounded-[length:var(--radius-x-large)] bg-[color:var(--color-sand-25)] px-[length:var(--padding-large)] py-[length:var(--size-64)]">
          <h1
            className="text-center text-[72px] font-light leading-[76px] text-[color:var(--text-primary)]"
            style={{ fontFamily: "var(--font-roca)" }}
          >
            Work.
          </h1>

          <div className="flex flex-col gap-[length:var(--size-16)]">
            {projects.map((project) => (
              <RouteTransitionLink
                key={project.slug}
                href={`/work/${project.slug}`}
                className="project-transition-link rounded-[length:var(--radius-medium)] border border-[color:var(--color-sand-150)] bg-[color:var(--color-sand-50)] p-[length:var(--padding-medium)] no-underline transition-colors hover:bg-[color:var(--color-sand-25)]"
              >
                <p className="text-[14px] uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                  {project.year}
                </p>
                <h2 className="mt-[length:var(--size-8)] text-[30px] leading-[36px] text-[color:var(--text-primary)]">
                  {project.title}
                </h2>
                <p className="mt-[length:var(--size-8)] text-[18px] leading-[26px] text-[color:var(--text-secondary)]">
                  {project.summary}
                </p>
              </RouteTransitionLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
