"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress/store";
import { getConceptBySlug } from "@/data/concepts";

const JOURNEY_SLUGS = [
  "hoisting",
  "closures",
  "currying",
  "this",
  "classes",
  "prototypes",
] as const;

export function LearningJourney() {
  const completedLessons = useProgress((s) => s.completedLessons);
  const journey = JOURNEY_SLUGS.map(getConceptBySlug).filter((c) => c !== undefined);

  return (
    <div className="rounded-lg border border-border bg-card/30 p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold">Your Learning Journey</h2>
      <ol className="flex flex-col flex-wrap items-start gap-2 sm:flex-row sm:items-center">
        {journey.map((concept, i) => {
          const isDone = completedLessons.includes(concept.slug);
          return (
            <li key={concept.slug} className="flex items-center gap-2">
              <Link
                href={`/learn/${concept.slug}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                  isDone
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-border bg-background hover:bg-accent"
                )}
              >
                {isDone && <CircleCheck className="size-3.5" aria-hidden />}
                {concept.title}
              </Link>
              {i < journey.length - 1 && (
                <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
