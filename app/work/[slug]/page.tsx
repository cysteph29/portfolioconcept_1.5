import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/src/components/case-study/CaseStudyLayout";
import { caseStudyMDXComponents } from "@/src/components/case-study/mdxComponents";
import { getAllProjectSlugs, getProjectBySlug } from "@/src/lib/content/projects";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.frontmatter.published) {
    notFound();
  }

  const Content = project.Component;

  return (
    <CaseStudyLayout
      title={project.frontmatter.title}
      slug={slug}
      coverImage={project.frontmatter.coverImage}
      metrics={project.frontmatter.metrics}
    >
      <Content components={caseStudyMDXComponents} />
    </CaseStudyLayout>
  );
}
