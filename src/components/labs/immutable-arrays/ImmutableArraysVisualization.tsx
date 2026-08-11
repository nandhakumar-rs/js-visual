"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export function ImmutableArraysVisualization({
  step,
}: LabVisualizationProps<ImmutableArrayInputs, ImmutableArrayStepState>) {
  const state = step?.state ?? { phase: "push-seed", array: [1, 2, 3], original: [1, 2, 3] };

  if (state.phase === "push-seed" || state.phase === "push-done") {
    return (
      <div className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <InlineCode>array</InlineCode>
          {state.phase === "push-done" && <StateBadge tone="changed">SAME ARRAY CHANGED</StateBadge>}
        </p>
        <ArrayVisualizer
          items={state.array.map((v, i) => ({
            id: `a-${i}`,
            label: String(v),
            status: i >= 3 ? "added" : "default",
          }))}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <InlineCode>original</InlineCode>
          <StateBadge tone="neutral">UNCHANGED</StateBadge>
        </p>
        <ArrayVisualizer items={state.original.map((v, i) => ({ id: `o-${i}`, label: String(v) }))} />
      </div>
      <div className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <InlineCode>updated</InlineCode>
          <StateBadge tone="new">NEW</StateBadge>
        </p>
        <ArrayVisualizer
          items={(state.updated ?? []).map((v, i) => ({
            id: `u-${i}`,
            label: String(v),
            status: i >= 3 ? "added" : "default",
          }))}
          emptyHint="Not created yet."
        />
      </div>
    </div>
  );
}
