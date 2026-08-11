"use client";

import { ArrowUp } from "lucide-react";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { ThisInputs, ThisStepState } from "./types";

export function ThisVisualization({ step }: LabVisualizationProps<ThisInputs, ThisStepState>) {
  const state = step?.state;
  if (!state) return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card/50 p-4">
        <span className="font-mono text-sm text-muted-foreground">{state.thisLabel}</span>
        <ArrowUp className="size-4 text-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">this</span>
      </div>
      {state.result && (
        <VariableBox
          name="return value"
          displayValue={state.result}
          status={state.isError ? "error" : "set"}
        />
      )}
    </div>
  );
}
