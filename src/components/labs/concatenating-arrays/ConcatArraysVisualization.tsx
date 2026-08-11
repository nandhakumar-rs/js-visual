"use client";

import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { ConcatArraysInputs, ConcatArraysStepState } from "./types";

export function ConcatArraysVisualization({
  step,
}: LabVisualizationProps<ConcatArraysInputs, ConcatArraysStepState>) {
  const state = step?.state ?? { a: [], b: [], result: [] };

  if (step?.id === "comparison") {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <InlineCode>a</InlineCode>
            <StateBadge tone="neutral">UNCHANGED</StateBadge>
          </p>
          <ArrayVisualizer items={state.a.map((v, i) => ({ id: `cmp-a-${i}`, label: String(v) }))} />
        </div>

        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <InlineCode>b</InlineCode>
            <StateBadge tone="neutral">UNCHANGED</StateBadge>
          </p>
          <ArrayVisualizer items={state.b.map((v, i) => ({ id: `cmp-b-${i}`, label: String(v) }))} />
        </div>

        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <InlineCode>result</InlineCode>
            <StateBadge tone="new">NEW</StateBadge>
          </p>
          <ArrayVisualizer
            items={state.result.map((r, i) => ({
              id: `cmp-r-${i}`,
              label: String(r.value),
              status: "added",
              sublabel: `from ${r.source}`,
            }))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          SOURCE A — <InlineCode>a</InlineCode>
        </p>
        <ArrayVisualizer items={state.a.map((v, i) => ({ id: `a-${i}`, label: String(v) }))} />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          SOURCE B — <InlineCode>b</InlineCode>
        </p>
        <ArrayVisualizer items={state.b.map((v, i) => ({ id: `b-${i}`, label: String(v) }))} />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          NEW RESULT — <InlineCode>result</InlineCode>
        </p>
        <ArrayVisualizer
          badge="NEW"
          items={state.result.map((r, i) => ({
            id: `r-${i}`,
            label: String(r.value),
            status: "added",
            sublabel: `from ${r.source}`,
          }))}
          emptyHint="Nothing combined yet."
        />
      </div>
    </div>
  );
}
