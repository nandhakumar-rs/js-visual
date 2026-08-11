"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export function ImmutableArraysVisualization({
  step,
}: LabVisualizationProps<ImmutableArrayInputs, ImmutableArrayStepState>) {
  const state = step?.state ?? { array: [1, 2, 3], sameReference: true };

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="array (ref A)"
        items={state.array.map((v, i) => ({ id: `a-${i}`, label: String(v) }))}
      />
      {state.newArray ? (
        <ArrayVisualizer
          label={`newArray (ref ${state.sameReference ? "A" : "B"})`}
          items={state.newArray.map((v, i) => ({
            id: `n-${i}`,
            label: String(v),
            status: i >= state.array.length ? "added" : "default",
          }))}
        />
      ) : null}
      <p className="text-xs text-muted-foreground">
        {state.newArray
          ? state.sameReference
            ? "array and newArray point to the same object."
            : "array and newArray are two different objects in memory."
          : "Only one array object exists so far."}
      </p>
    </div>
  );
}
