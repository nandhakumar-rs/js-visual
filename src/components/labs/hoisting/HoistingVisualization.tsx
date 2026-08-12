"use client";

import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import type { LabVisualizationProps } from "@/types/lab";
import { BindingRecord } from "./BindingRecord";
import type { BindingPhase, HoistingInputs, HoistingStepState } from "./types";

const STAGES = [
  { id: "enter", label: "Enter the scope" },
  { id: "prepare", label: "Prepare declarations" },
  { id: "run", label: "Run statements" },
];

// Five tracked phases collapse onto three displayed stages: everything from
// the first statement onward is one beat to the learner.
const STAGE_FOR_PHASE: Record<BindingPhase, string> = {
  entering: "enter",
  preparing: "prepare",
  "before-declaration": "run",
  "after-declaration": "run",
  halted: "run",
};

export function HoistingVisualization({ step }: LabVisualizationProps<HoistingInputs, HoistingStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  return (
    <div className="space-y-3">
      <PhaseStrip stages={STAGES} currentId={STAGE_FOR_PHASE[state.phase]} />
      <BindingRecord state={state} />
    </div>
  );
}
