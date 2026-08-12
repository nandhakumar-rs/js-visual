"use client";

import { cn } from "@/lib/utils";
import type { LabVisualizationProps } from "@/types/lab";
import { BindingRecord } from "./BindingRecord";
import type { BindingPhase, HoistingInputs, HoistingStepState } from "./types";

const PHASE_STRIP: { id: BindingPhase[]; label: string }[] = [
  { id: ["entering"], label: "Enter the scope" },
  { id: ["preparing"], label: "Prepare declarations" },
  { id: ["before-declaration", "after-declaration", "halted"], label: "Run statements" },
];

function PhaseStrip({ phase }: { phase: BindingPhase }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="Current phase">
      {PHASE_STRIP.map((entry, index) => {
        const isCurrent = entry.id.includes(phase);
        return (
          <li key={entry.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden className="text-muted-foreground">
                &rarr;
              </span>
            )}
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                isCurrent ? "bg-primary/15 text-foreground ring-1 ring-primary/40" : "bg-muted text-muted-foreground"
              )}
            >
              {entry.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function HoistingVisualization({ step }: LabVisualizationProps<HoistingInputs, HoistingStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  return (
    <div className="space-y-3">
      <PhaseStrip phase={state.phase} />
      <BindingRecord state={state} />
    </div>
  );
}
