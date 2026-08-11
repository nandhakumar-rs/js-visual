"use client";

import { ScopeBox } from "@/components/visualizers/ScopeBox";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { DebounceInputs, DebounceStepState } from "./types";

export function DebounceVisualization({
  step,
}: LabVisualizationProps<DebounceInputs, DebounceStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Type in the search box to begin.</p>;
  }

  const timerDisplay =
    state.timerStatus === "running"
      ? { status: "set" as const, displayValue: "running" }
      : state.timerStatus === "fired"
        ? { status: "updated" as const, displayValue: "cleared (fired)" }
        : { status: "undefined" as const, displayValue: "undefined" };

  return (
    <div className="space-y-3">
      <ScopeBox label="debounce() closure" kind="closure" isActive variables={[{ name: "timer", ...timerDisplay }]} />
      <div className="flex flex-wrap gap-2">
        <VariableBox name="keystrokes" value={state.keystrokes} status="set" size="sm" />
        <VariableBox name="raw calls" value={state.rawCalls} status="set" size="sm" />
        <VariableBox name="debounced calls" value={state.debouncedCalls} status="updated" size="sm" />
      </div>
    </div>
  );
}
