"use client";

import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { ThrottleInputs, ThrottleStepState } from "./types";

export function ThrottleVisualization({
  step,
}: LabVisualizationProps<ThrottleInputs, ThrottleStepState>) {
  const state = step?.state ?? { events: 0, calls: 0, blocked: 0, wasBlocked: false };

  return (
    <div className="flex flex-wrap gap-2">
      <VariableBox name="events" value={state.events} status="set" size="sm" />
      <VariableBox name="calls" value={state.calls} status="updated" size="sm" />
      <VariableBox name="blocked" value={state.blocked} status={state.wasBlocked ? "error" : "undefined"} size="sm" />
    </div>
  );
}
