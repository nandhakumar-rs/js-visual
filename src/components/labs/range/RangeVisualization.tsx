"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { RangeInputs, RangeStepState } from "./types";

export function RangeVisualization({ step }: LabVisualizationProps<RangeInputs, RangeStepState>) {
  const state = step?.state ?? { result: [] };

  return (
    <ArrayVisualizer
      label="result"
      items={state.result.map((v, i) => ({
        id: `r-${i}`,
        label: String(v),
        status: v === state.current ? "active" : "added",
      }))}
      emptyHint="Nothing pushed yet."
    />
  );
}
