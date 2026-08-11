"use client";

import { useState, type ReactNode } from "react";
import type { ExecutionEngine } from "@/lib/execution/useExecutionEngine";
import type { Concept } from "@/types/concept";
import type { ExperienceConfig, ExplainSummaryConfig } from "./types";
import { LessonHeader } from "./LessonHeader";
import { ExperienceIntro } from "./ExperienceIntro";
import { ExplainSummary } from "./ExplainSummary";
import { ExperimentControls } from "./ExperimentControls";

export interface GuidedLessonShellProps {
  concept: Concept;
  positionInSection: number;
  totalInSection: number;
  explanation: ReactNode;
  experience?: ExperienceConfig;
  code: ReactNode;
  visualization: ReactNode;
  stepController?: ReactNode;
  consolePanel?: ReactNode;
  whyPanel?: ReactNode;
  experiment?: { prompt?: string; controls: ReactNode };
  explainSummary?: ExplainSummaryConfig;
  // Type-erased like StepController's engine prop — GuidedLessonShell only
  // needs `play()`/`isLast`, and the concrete TState varies per lab.
  engine: ExecutionEngine<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  prediction?: ReactNode;
  footer?: ReactNode;
}

/**
 * Phase-ordered lesson shell for the "guided" layout: Understand → Watch it
 * work (with an inline "try it yourself" experiment once the walkthrough
 * completes) → Why? → Test yourself → Challenge. A sibling to LessonShell
 * (not a branch inside it) so the classic layout used by every other lab
 * stays completely unaffected. Reuses the same subcomponents LessonShell
 * does — only the section arrangement is new.
 */
export function GuidedLessonShell({
  concept,
  positionInSection,
  totalInSection,
  explanation,
  experience,
  code,
  visualization,
  stepController,
  consolePanel,
  whyPanel,
  experiment,
  explainSummary,
  engine,
  prediction,
  footer,
}: GuidedLessonShellProps) {
  // Latches on the first time the walkthrough is completed (Play or manual
  // stepping) and never turns back off, even after a value change resets
  // currentIndex — so "Try it yourself" never disappears mid-experiment.
  // Adjusted during render (not an effect) per the project's convention of
  // avoiding setState-in-effect for derived state.
  const [everCompleted, setEverCompleted] = useState(false);
  if (engine.isLast && !everCompleted) {
    setEverCompleted(true);
  }

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
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {code}
            {stepController}
          </div>
          <div className="space-y-3">{visualization}</div>
        </div>
        {consolePanel}
        {whyPanel}
        {experiment && (
          <ExperimentControls prompt={experiment.prompt} visible={everCompleted} onRun={() => engine.play()}>
            {experiment.controls}
          </ExperimentControls>
        )}
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
