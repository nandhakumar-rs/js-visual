"use client";

import { ArrowDown } from "lucide-react";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { ClassesInputs, ClassesStepState } from "./types";

export function ClassesVisualization({ step }: LabVisualizationProps<ClassesInputs, ClassesStepState>) {
  const state = step?.state;
  if (!state) return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;

  return (
    <div className="space-y-3">
      {state.className && (
        <div className="flex flex-col items-center gap-1.5">
          <span className="rounded-md border border-border bg-muted/40 px-3 py-1 text-xs font-medium">
            {state.className} class
          </span>
          <ArrowDown className="size-3.5 text-muted-foreground" aria-hidden />
        </div>
      )}
      {state.instanceLabel && (
        <ObjectVisualizer
          label={state.instanceLabel}
          isActive
          entries={state.props.map((p) => ({ key: p.key, displayValue: `"${p.value}"` }))}
        />
      )}
      {state.result && <VariableBox name="greet()" displayValue={`"${state.result}"`} status="updated" />}
    </div>
  );
}
