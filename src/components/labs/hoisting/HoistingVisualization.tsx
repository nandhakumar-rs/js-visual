"use client";

import { ScopeBox } from "@/components/visualizers/ScopeBox";
import { CallStack } from "@/components/visualizers/CallStack";
import type { LabVisualizationProps } from "@/types/lab";
import type { HoistingInputs, HoistingStepState } from "./types";

export function HoistingVisualization({
  step,
}: LabVisualizationProps<HoistingInputs, HoistingStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  return (
    <div className="space-y-3">
      <ScopeBox
        label="Global Environment"
        kind="global"
        isActive
        variables={[
          {
            name: state.binding.name,
            status: state.binding.status,
            displayValue: state.binding.displayValue,
            previousValue: state.binding.previousValue,
          },
        ]}
      />
      <CallStack frames={state.callStack} />
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Phase: <span className="text-foreground">{state.phase}</span>
      </p>
    </div>
  );
}
