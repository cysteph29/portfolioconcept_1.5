import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";
import SalesforceTrailheadCaseStudy, {
  metadata as salesforceTrailheadMetadata,
} from "@/src/content/projects/salesforce-trailhead.mdx";
import AxwayOneCaseStudy, {
  metadata as axwayOneMetadata,
} from "@/src/content/projects/axway-one.mdx";
import TheKenCaseStudy, {
  metadata as theKenMetadata,
} from "@/src/content/projects/the-ken.mdx";
import { assertProjectFrontmatter } from "@/src/lib/content/schema";
import type { ProjectFrontmatter } from "@/src/lib/content/types";

type ProjectMDXComponent = ComponentType<{ components?: MDXComponents }>;

interface ProjectRegistryEntry {
  frontmatter: ProjectFrontmatter;
  Component: ProjectMDXComponent;
}

const registry = {
  "salesforce-trailhead": {
    frontmatter: salesforceTrailheadMetadata,
    Component: SalesforceTrailheadCaseStudy,
  },
  "axway-one": {
    frontmatter: axwayOneMetadata,
    Component: AxwayOneCaseStudy,
  },
  "the-ken": {
    frontmatter: theKenMetadata,
    Component: TheKenCaseStudy,
  },
} satisfies Record<string, ProjectRegistryEntry>;

for (const [slug, entry] of Object.entries(registry)) {
  assertProjectFrontmatter(entry.frontmatter);
  if (entry.frontmatter.slug !== slug) {
    throw new Error(
      `Project slug mismatch. Expected "${slug}", got "${entry.frontmatter.slug}".`,
    );
  }
}

export function getProjectBySlug(slug: string): ProjectRegistryEntry | null {
  return registry[slug] ?? null;
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(registry);
}

export function getAllPublishedProjectFrontmatter(): ProjectFrontmatter[] {
  return Object.values(registry)
    .map((entry) => entry.frontmatter)
    .filter((entry) => entry.published)
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));
}
