"use client";

import { CallStack } from "@/components/visualizers/CallStack";
import type { LabVisualizationProps } from "@/types/lab";
import type { ExecutionContextInputs, ExecutionContextStepState } from "./types";

export function ExecutionContextVisualization({
  step,
}: LabVisualizationProps<ExecutionContextInputs, ExecutionContextStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  return (
    <div className="space-y-3">
      <CallStack frames={state.callStack} />
    </div>
  );
}
