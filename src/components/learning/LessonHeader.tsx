import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SECTION_META, type Concept } from "@/types/concept";

export interface LessonHeaderProps {
  concept: Concept;
  positionInSection: number;
  totalInSection: number;
  explanation?: ReactNode;
}

export function LessonHeader({ concept, positionInSection, totalInSection, explanation }: LessonHeaderProps) {
  const sectionMeta = SECTION_META[concept.section];

  return (
    <header className="space-y-3">
      <Link
        href={sectionMeta.path}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {sectionMeta.title}
      </Link>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{concept.title}</h1>
        <span className="text-sm tabular-nums text-muted-foreground">
          {positionInSection} / {totalInSection}
        </span>
      </div>
      {explanation}
    </header>
  );
}
