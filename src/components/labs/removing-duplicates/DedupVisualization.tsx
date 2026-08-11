"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { DedupInputs, DedupStepState } from "./types";

export function DedupVisualization({ step, inputs }: LabVisualizationProps<DedupInputs, DedupStepState>) {
  const state = step?.state ?? { visitedIndex: -1, seen: [], isDuplicate: false };

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="array"
        items={inputs.array.map((v, i) => ({
          id: `a-${i}`,
          label: String(v),
          status:
            i === state.visitedIndex
              ? state.isDuplicate
                ? "reject"
                : "active"
              : i < state.visitedIndex
                ? "default"
                : "default",
        }))}
      />
      <ArrayVisualizer
        label={`Set { ${state.seen.join(", ")} }`}
        items={state.seen.map((v, i) => ({ id: `s-${i}`, label: String(v), status: "match" }))}
        emptyHint="Empty so far."
      />
    </div>
  );
}
