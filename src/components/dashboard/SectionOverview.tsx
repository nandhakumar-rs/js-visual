"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getConceptsBySection } from "@/data/concepts";
import { SECTION_META, type ConceptSection } from "@/types/concept";
import { useProgress } from "@/lib/progress/store";
import { isLabImplemented } from "@/components/labs/registry";
import { ProgressIndicator } from "@/components/learning/ProgressIndicator";

export interface SectionOverviewProps {
  section: ConceptSection;
}

export function SectionOverview({ section }: SectionOverviewProps) {
  const meta = SECTION_META[section];
  const items = getConceptsBySection(section);
  const completedLessons = useProgress((s) => s.completedLessons);
  const completed = items.filter((i) => completedLessons.includes(i.slug)).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="font-mono text-sm text-muted-foreground">{meta.number}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="max-w-xl text-muted-foreground">{meta.blurb}</p>
        <ProgressIndicator completed={completed} total={items.length} className="max-w-xs" />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((concept) => {
          const isDone = completedLessons.includes(concept.slug);
          const implemented = isLabImplemented(concept.slug);
          return (
            <Link key={concept.slug} href={`/learn/${concept.slug}`}>
              <Card
                className={cn(
                  "h-full transition-colors hover:border-primary/50",
                  !implemented && "opacity-70"
                )}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <h2 className="font-medium">{concept.title}</h2>
                  {isDone && <CircleCheck className="size-4 shrink-0 text-emerald-500" aria-hidden />}
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{concept.simpleDescription}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {concept.difficulty}
                    </Badge>
                    {!implemented ? (
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    ) : (
                      <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
