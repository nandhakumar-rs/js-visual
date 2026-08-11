"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { ConcatArraysInputs, ConcatArraysStepState } from "./types";

export function ConcatArraysVisualization({
  step,
}: LabVisualizationProps<ConcatArraysInputs, ConcatArraysStepState>) {
  const state = step?.state ?? { a: [], b: [] };

  return (
    <div className="space-y-3">
      <ArrayVisualizer label="a" items={state.a.map((v, i) => ({ id: `a-${i}`, label: String(v) }))} />
      <ArrayVisualizer label="b" items={state.b.map((v, i) => ({ id: `b-${i}`, label: String(v) }))} />
      {state.result && (
        <ArrayVisualizer
          label="result (new array)"
          items={state.result.map((v, i) => ({ id: `r-${i}`, label: String(v), status: "added" }))}
        />
      )}
    </div>
  );
}
