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

  if (step?.id === "comparison") {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <InlineCode>push()</InlineCode>
            <StateBadge tone="changed">SAME ARRAY CHANGED</StateBadge>
          </p>
          <ArrayVisualizer
            label="array"
            items={state.array.map((v, i) => ({
              id: `cmp-a-${i}`,
              label: String(v),
              status: i >= 3 ? "added" : "default",
            }))}
          />
        </div>

        <div className="space-y-1.5">
          <p className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground">
            spread
            <span className="inline-flex items-center gap-1.5">
              <InlineCode>original</InlineCode>
              <StateBadge tone="neutral">UNCHANGED</StateBadge>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <InlineCode>updated</InlineCode>
              <StateBadge tone="new">NEW</StateBadge>
            </span>
          </p>
          <ArrayVisualizer
            label="original"
            items={state.original.map((v, i) => ({ id: `cmp-o-${i}`, label: String(v) }))}
          />
          <ArrayVisualizer
            label="updated"
            items={(state.updated ?? []).map((v, i) => ({
              id: `cmp-u-${i}`,
              label: String(v),
              status: i >= 3 ? "added" : "default",
            }))}
          />
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3 text-center text-sm">
          <p>
            <InlineCode>push()</InlineCode> → same array changed.
          </p>
          <p className="text-xs text-muted-foreground">spread → original unchanged, new array created.</p>
        </div>
      </div>
    );
  }

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
