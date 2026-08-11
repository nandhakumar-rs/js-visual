import type { ReactNode } from "react";
import type { Concept } from "@/types/concept";
import { LessonHeader } from "./LessonHeader";

export interface LessonShellProps {
  concept: Concept;
  positionInSection: number;
  totalInSection: number;
  explanation: ReactNode;
  controls?: ReactNode;
  code: ReactNode;
  visualization: ReactNode;
  stepController?: ReactNode;
  consolePanel?: ReactNode;
  whyPanel?: ReactNode;
  footer?: ReactNode;
}

export function LessonShell({
  concept,
  positionInSection,
  totalInSection,
  explanation,
  controls,
  code,
  visualization,
  stepController,
  consolePanel,
  whyPanel,
  footer,
}: LessonShellProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <LessonHeader
        concept={concept}
        positionInSection={positionInSection}
        totalInSection={totalInSection}
        explanation={explanation}
      />

      {controls && (
        <section aria-label="Interactive controls" className="rounded-lg border border-border bg-card/40 p-4">
          {controls}
        </section>
      )}

      <section aria-label="Code and visualization" className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Code</h2>
          {code}
          {stepController}
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Visualization</h2>
          {visualization}
        </div>
      </section>

      {consolePanel && <section aria-label="Console">{consolePanel}</section>}

      {whyPanel}

      {footer && <section aria-label="Lesson wrap-up">{footer}</section>}
    </div>
  );
}
