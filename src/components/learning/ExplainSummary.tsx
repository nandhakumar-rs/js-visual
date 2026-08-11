"use client";

import { Lightbulb, Sparkle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExplanationMode } from "@/lib/ui-state/explanation-mode-store";
import type { ExplainSummaryConfig } from "./types";

export interface ExplainSummaryProps extends ExplainSummaryConfig {
  className?: string;
}

/**
 * Generic bullet-list explanation card for a guided lesson's "Why?" phase —
 * short, compact, and reusable by future lessons with their own bullet
 * content (which may itself embed InfoTooltips). `quirkNote` is a small
 * always-shown callout; `technicalNote` only appears in Technical mode, so
 * Technical mode deepens the same lesson rather than duplicating it.
 */
export function ExplainSummary({
  title = "What's really going on",
  bullets,
  quirkNote,
  technicalNote,
  className,
}: ExplainSummaryProps) {
  const mode = useExplanationMode((s) => s.mode);

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
        {mode === "technical" && technicalNote && (
          <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <Sparkle className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
            <span>{technicalNote}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
