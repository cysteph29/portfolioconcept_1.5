import type { MDXComponents } from "mdx/types";
import { caseStudyMDXComponents } from "@/src/components/case-study/mdxComponents";

const components: MDXComponents = {
  ...caseStudyMDXComponents,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
