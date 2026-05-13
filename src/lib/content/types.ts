export type ProjectStatus = "concept" | "in-progress" | "launched";

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  summary: string;
  role: string;
  year: string;
  timeline?: string;
  status: ProjectStatus;
  tags: string[];
  coverImage: string;
  metrics?: ProjectMetric[];
  published: boolean;
  featured: boolean;
  sortOrder?: number;
}

export interface ProjectEntry {
  frontmatter: ProjectFrontmatter;
  body: string;
}
