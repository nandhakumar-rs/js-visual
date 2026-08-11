"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/learning/ProgressIndicator";
import { useProgress } from "@/lib/progress/store";
import { getConceptsBySection } from "@/data/concepts";
import { SECTION_META, type ConceptSection } from "@/types/concept";

export interface SectionCardProps {
  section: ConceptSection;
}

export function SectionCard({ section }: SectionCardProps) {
  const meta = SECTION_META[section];
  const items = getConceptsBySection(section);
  const completedLessons = useProgress((s) => s.completedLessons);
  const completed = items.filter((i) => completedLessons.includes(i.slug)).length;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <span className="font-mono text-sm text-muted-foreground">{meta.number}</span>
        <h3 className="text-xl font-semibold tracking-tight">{meta.title}</h3>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground">{meta.blurb}</p>
        <ProgressIndicator completed={completed} total={items.length} />
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="gap-1.5 px-0 text-primary hover:bg-transparent hover:text-primary"
          render={
            <Link href={meta.path}>
              Continue
              <ArrowRight className="size-4" />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
