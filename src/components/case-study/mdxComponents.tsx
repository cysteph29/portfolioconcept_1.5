import type { MDXComponents } from "mdx/types";
import {
  CaseStudyFigure,
  CaseStudyOutcomeSection,
  CaseStudyProblemSection,
  CaseStudyQuote,
  CaseStudySectionDivider,
  CaseStudySectionHeading,
  CaseStudySolutionSection,
  InlineMetrics,
} from "@/src/components/case-study/CaseStudyLayout";

export const caseStudyMDXComponents: MDXComponents = {
  h2: ({ children }) => <CaseStudySectionHeading>{children}</CaseStudySectionHeading>,
  Figure: CaseStudyFigure,
  PullQuote: CaseStudyQuote,
  InlineMetrics,
  ProblemSection: CaseStudyProblemSection,
  SolutionSection: CaseStudySolutionSection,
  OutcomeSection: CaseStudyOutcomeSection,
  SectionDivider: CaseStudySectionDivider,
};
