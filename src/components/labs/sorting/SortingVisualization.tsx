"use client";

import { ArrayVisualizer, type ArrayItemStatus } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { SortingInputs, SortingStepState } from "./types";

const EMPTY_STATE: SortingStepState = {
  numbers: [],
  sorted: null,
  compareValues: null,
  comparisons: null,
  isFinal: false,
};

export function SortingVisualization({ step, inputs }: LabVisualizationProps<SortingInputs, SortingStepState>) {
  const state = step?.state ?? { ...EMPTY_STATE, numbers: inputs.values };
  const activeValues = new Set(state.comparisons?.flatMap((c) => [c.a, c.b]) ?? []);
  const isMutating = inputs.mode !== "immutable";

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="SOURCE ARRAY — numbers"
        items={state.numbers.map((v, i) => ({
          id: `n-${i}`,
          label: String(v),
          status: (activeValues.has(v) ? "active" : "default") as ArrayItemStatus,
        }))}
      />

      {(state.compareValues || state.comparisons) && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">COMPARISON RULE</p>

          {state.compareValues && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
              {state.compareValues.map((v, i) => (
                <InlineCode key={i}>{`"${v}"`}</InlineCode>
              ))}
            </div>
          )}

          {state.comparisons && (
            <div className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
              {state.comparisons.length === 0 && <p className="text-muted-foreground">Nothing to compare.</p>}
              {state.comparisons.map((c, i) => {
                const exprLeft = inputs.mode === "desc" ? c.b : c.a;
                const exprRight = inputs.mode === "desc" ? c.a : c.b;
                const conclusion = c.result < 0 ? `${c.a} comes first` : c.result > 0 ? `${c.b} comes first` : "tie";
                return (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <InlineCode>{`${exprLeft} - ${exprRight} = ${c.result}`}</InlineCode>
                    <span className="text-muted-foreground">→</span>
                    <StateBadge tone={c.result === 0 ? "neutral" : "new"}>{conclusion}</StateBadge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ArrayVisualizer
        label="SORTED RESULT — sorted"
        badge={inputs.mode === "immutable" ? "NEW" : undefined}
        emptyHint="Nothing sorted yet."
        items={(state.sorted ?? []).map((v, i) => ({ id: `s-${i}`, label: String(v), status: "added" }))}
      />

      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">REFERENCE / MUTATION STATUS</p>
        {state.isFinal && state.sorted ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
            <InlineCode>sorted === numbers</InlineCode>
            <span className="text-muted-foreground">→</span>
            <StateBadge tone={isMutating ? "changed" : "new"}>{String(isMutating)}</StateBadge>
            <StateBadge tone={isMutating ? "changed" : "new"}>
              {isMutating ? "SAME ARRAY MUTATED" : "NEW ARRAY CREATED"}
            </StateBadge>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-3 text-center text-sm text-muted-foreground">
            Not sorted yet.
          </p>
        )}
      </div>
    </div>
  );
}
