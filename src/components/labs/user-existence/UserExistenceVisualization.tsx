"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { UserExistenceInputs, UserExistenceStepState } from "./types";

export function UserExistenceVisualization({
  step,
  inputs,
}: LabVisualizationProps<UserExistenceInputs, UserExistenceStepState>) {
  const state = step?.state ?? { visitedIndex: -1, matchedIndex: -1 };

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="users"
        items={inputs.users.map((name, i) => ({
          id: `u-${i}`,
          label: name,
          status:
            i === state.matchedIndex
              ? "match"
              : i <= state.visitedIndex
                ? "reject"
                : "default",
        }))}
      />
      {state.returnValue !== undefined && (
        <p className="text-sm">
          Return value: <span className="font-mono font-semibold">{state.returnValue}</span>
        </p>
      )}
    </div>
  );
}
