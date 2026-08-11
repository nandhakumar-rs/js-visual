"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { SortingInputs, SortingStepState } from "./types";

export function SortingVisualization({ step, inputs }: LabVisualizationProps<SortingInputs, SortingStepState>) {
  const state = step?.state ?? { numbers: inputs.array };
  const [ci, cj] = state.compareIndices ?? [-1, -1];

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="numbers"
        items={state.numbers.map((v, i) => ({
          id: `n-${i}`,
          label: String(v),
          status: i === ci || i === cj ? (state.swapped ? "active" : "reject") : "default",
        }))}
      />
      {state.sorted && (
        <ArrayVisualizer
          label="sorted (new array)"
          items={state.sorted.map((v, i) => ({ id: `s-${i}`, label: String(v), status: "added" }))}
        />
      )}
    </div>
  );
}
