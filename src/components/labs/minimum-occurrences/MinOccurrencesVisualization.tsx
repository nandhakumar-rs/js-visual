"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { MinOccurrencesInputs, MinOccurrencesStepState } from "./types";

export function MinOccurrencesVisualization({
  step,
  inputs,
}: LabVisualizationProps<MinOccurrencesInputs, MinOccurrencesStepState>) {
  const state = step?.state ?? { stage: "scanning", matchIndices: [] };

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        items={inputs.array.map((v, i) => ({
          id: `v-${i}`,
          label: String(v),
          status:
            state.stage === "scanning"
              ? i === state.activeIndex
                ? "active"
                : "default"
              : state.matchIndices.includes(i)
                ? "match"
                : state.stage === "counting" || state.stage === "done"
                  ? "reject"
                  : "default",
        }))}
      />
      {state.currentMin !== undefined && Number.isFinite(state.currentMin) && (
        <p className="text-sm">
          Current minimum: <span className="font-mono font-semibold">{state.currentMin}</span>
        </p>
      )}
      {state.occurrences !== undefined && (
        <p className="text-sm">
          Occurrences: <span className="font-mono font-semibold">{state.occurrences}</span>
        </p>
      )}
    </div>
  );
}
