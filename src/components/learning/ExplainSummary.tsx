"use client";

import { Lightbulb, Sparkle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExplainSummaryConfig } from "./types";

export interface ExplainSummaryProps extends ExplainSummaryConfig {
  className?: string;
}

/**
 * Generic bullet-list explanation card for a guided lesson's "Why?" phase —
 * short, compact, and reusable by future lessons with their own bullet
 * content (which may itself embed InfoTooltips). `quirkNote` and
 * `technicalNote` are both always-shown callouts — only the page's top
 * intro text depends on the Concept/Technical toggle.
 */
export function ExplainSummary({
  title = "What's really going on",
  bullets,
  quirkNote,
  technicalNote,
  className,
}: ExplainSummaryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        {quirkNote && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
            {quirkNote}
          </div>
        )}
        {technicalNote && (
          <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <Sparkle className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
            <span>{technicalNote}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
