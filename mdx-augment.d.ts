declare module "*.mdx" {
  import type { ProjectFrontmatter } from "@/src/lib/content/types";

  export const metadata: ProjectFrontmatter;
}
