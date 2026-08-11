"use client";

import type { ReactNode } from "react";
import type { Concept } from "@/types/concept";
import type { ExperienceConfig, ExplainSummaryConfig } from "./types";
import { LessonHeader } from "./LessonHeader";
import { ExperienceIntro } from "./ExperienceIntro";
import { ExplainSummary } from "./ExplainSummary";

export interface GuidedLessonShellProps {
  concept: Concept;
  positionInSection: number;
  totalInSection: number;
  explanation: ReactNode;
  experience?: ExperienceConfig;
  code: ReactNode;
  visualization: ReactNode;
  /** Always-visible controls above the code/visualization split — see LabDefinition.simulationControls. */
  simulationControls?: ReactNode;
  stepController?: ReactNode;
  consolePanel?: ReactNode;
  whyPanel?: ReactNode;
  explainSummary?: ExplainSummaryConfig;
  prediction?: ReactNode;
  footer?: ReactNode;
}

/**
 * Phase-ordered lesson shell for the "guided" layout: Understand → Watch it
 * work (with any simulation-configuring controls always visible above the
 * player, never gated behind completing a run) → Why? → Test yourself →
 * Challenge. A sibling to LessonShell (not a branch inside it) so the
 * classic layout used by every other lab stays completely unaffected.
 * Reuses the same subcomponents LessonShell does — only the section
 * arrangement is new.
 */
export function GuidedLessonShell({
  concept,
  positionInSection,
  totalInSection,
  explanation,
  experience,
  code,
  visualization,
  simulationControls,
  stepController,
  consolePanel,
  whyPanel,
  explainSummary,
  prediction,
  footer,
}: GuidedLessonShellProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <LessonHeader
        concept={concept}
        positionInSection={positionInSection}
        totalInSection={totalInSection}
        explanation={explanation}
      />

      {experience && (
        <section aria-label="Understand" className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">1. Understand</h2>
          <ExperienceIntro {...experience} />
        </section>
      )}

      <section aria-label="Watch it work" className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">2. Watch it work</h2>
        {simulationControls && (
          <div className="rounded-lg border border-border bg-card/40 p-3">{simulationControls}</div>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {code}
            {stepController}
          </div>
          <div className="space-y-3">{visualization}</div>
        </div>
        {consolePanel}
        {whyPanel}
      </section>

      {explainSummary && (
        <section aria-label="Why" className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">3. Why?</h2>
          <ExplainSummary {...explainSummary} />
        </section>
      )}

      {prediction && (
        <section aria-label="Test yourself" className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">4. Test yourself</h2>
          {prediction}
        </section>
      )}

      {footer && (
        <section aria-label="Challenge" className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">5. Challenge</h2>
          {footer}
        </section>
      )}
    </div>
  );
}
