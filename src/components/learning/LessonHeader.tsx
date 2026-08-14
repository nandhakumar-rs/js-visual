import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SECTION_META, type Concept } from "@/types/concept";

export interface LessonHeaderProps {
  concept: Concept;
  explanation?: ReactNode;
}

export function LessonHeader({ concept, explanation }: LessonHeaderProps) {
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
      {/* Progress lives in the app header's ring — no second counter here. */}
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{concept.title}</h1>
      {explanation}
    </header>
  );
}
