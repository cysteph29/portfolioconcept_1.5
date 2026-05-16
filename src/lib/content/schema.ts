import type { ProjectFrontmatter, ProjectStatus } from "./types";

const allowedStatuses: ProjectStatus[] = ["concept", "in-progress", "launched"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => isNonEmptyString(item));
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isMetricsArray(
  value: unknown,
): value is Array<{ value: string; label: string }> {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        !!item &&
        typeof item === "object" &&
        isNonEmptyString((item as Record<string, unknown>).value) &&
        isNonEmptyString((item as Record<string, unknown>).label),
    )
  );
}

export function isProjectFrontmatter(
  value: unknown,
): value is ProjectFrontmatter {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  const status = candidate.status;

  const hasValidStatus =
    isNonEmptyString(status) &&
    allowedStatuses.includes(status as ProjectStatus);

  const hasValidSortOrder =
    candidate.sortOrder === undefined ||
    typeof candidate.sortOrder === "number";

  const hasValidTimeline =
    candidate.timeline === undefined || isNonEmptyString(candidate.timeline);

  const hasValidMetrics =
    candidate.metrics === undefined || isMetricsArray(candidate.metrics);

  const hasValidCoverVideo =
    candidate.coverVideo === undefined ||
    isNonEmptyString(candidate.coverVideo);

  return (
    isNonEmptyString(candidate.title) &&
    isNonEmptyString(candidate.slug) &&
    isNonEmptyString(candidate.summary) &&
    isNonEmptyString(candidate.role) &&
    isNonEmptyString(candidate.year) &&
    hasValidTimeline &&
    hasValidStatus &&
    isStringArray(candidate.tags) &&
    isNonEmptyString(candidate.coverImage) &&
    hasValidCoverVideo &&
    hasValidMetrics &&
    isBoolean(candidate.published) &&
    isBoolean(candidate.featured) &&
    hasValidSortOrder
  );
}

export function assertProjectFrontmatter(
  value: unknown,
): asserts value is ProjectFrontmatter {
  if (!isProjectFrontmatter(value)) {
    throw new Error("Invalid project frontmatter shape.");
  }
}
