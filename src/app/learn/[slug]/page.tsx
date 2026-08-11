import { notFound } from "next/navigation";
import { getConceptBySlug, getConceptsBySection } from "@/data/concepts";
import { isLabImplemented } from "@/components/labs/registry";
import { LabRuntime } from "@/components/learning/LabRuntime";
import { LessonHeader } from "@/components/learning/LessonHeader";
import { ExplanationPanel } from "@/components/learning/ExplanationPanel";
import { ComingSoonPanel } from "@/components/learning/ComingSoonPanel";

export default async function ConceptPage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const concept = getConceptBySlug(slug);

  if (!concept) notFound();

  const sectionConcepts = getConceptsBySection(concept.section);
  const positionInSection = sectionConcepts.findIndex((c) => c.slug === slug) + 1;
  const totalInSection = sectionConcepts.length;

  if (!isLabImplemented(slug)) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <LessonHeader
          concept={concept}
          positionInSection={positionInSection}
          totalInSection={totalInSection}
          explanation={<ExplanationPanel concept={concept} />}
        />
        <ComingSoonPanel concept={concept} />
      </div>
    );
  }

  return (
    <LabRuntime
      slug={slug}
      concept={concept}
      positionInSection={positionInSection}
      totalInSection={totalInSection}
    />
  );
}
