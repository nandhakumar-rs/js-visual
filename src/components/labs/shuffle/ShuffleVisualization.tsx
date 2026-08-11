"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { ShuffleInputs, ShuffleStepState } from "./types";

export function ShuffleVisualization({ step, inputs }: LabVisualizationProps<ShuffleInputs, ShuffleStepState>) {
  const state = step?.state ?? { items: inputs.items };
  const [si, sj] = state.swapIndices ?? [-1, -1];

  return (
    <ArrayVisualizer
      items={state.items.map((v, i) => ({
        id: `i-${i}`,
        label: v,
        status: i === si || i === sj ? "active" : "default",
      }))}
    />
  );
}
