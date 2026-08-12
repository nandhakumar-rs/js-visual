"use client";

import { ArrayVisualizer, type ArrayItemStatus } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { RangeInputs, RangeLineStatus, RangeStepState } from "./types";

const MAX_ITEMS = 100;

const STATUS_MAP: Record<RangeLineStatus, ArrayItemStatus> = {
  pending: "default",
  included: "match",
  excluded: "reject",
};

const EMPTY_STATE: RangeStepState = {
  line: [],
  result: [],
  currentValue: null,
  boundaryCheck: null,
  isFinal: false,
  direction: "up",
  capped: false,
};

export function RangeVisualization({ step, inputs }: LabVisualizationProps<RangeInputs, RangeStepState>) {
  const state = step?.state ?? EMPTY_STATE;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["START", inputs.start],
            ["END", inputs.end],
            ["STEP", inputs.step],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-md border border-border bg-card/50 px-3 py-1.5 text-center">
            <p className="text-[0.65rem] font-medium text-muted-foreground">{label}</p>
            <p className="font-mono text-sm">{value}</p>
          </div>
        ))}
      </div>

      <ArrayVisualizer
        label="NUMBER LINE / MOVEMENT"
        items={state.line.map((item, i) => ({
          id: `line-${i}`,
          label: String(item.value),
          status: STATUS_MAP[item.status],
          sublabel: item.isBoundary
            ? item.status === "excluded"
              ? "NOT INCLUDED"
              : "boundary"
            : item.status === "included"
              ? "INCLUDED"
              : undefined,
        }))}
        emptyHint="Not started yet."
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">CURRENT VALUE</p>
          <p className="font-mono text-sm">{state.currentValue !== null ? state.currentValue : "Not started yet."}</p>
        </div>
        <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">BOUNDARY CHECK</p>
          {state.boundaryCheck ? (
            <div className="flex flex-wrap items-center gap-2">
              <InlineCode>{state.boundaryCheck.expression}</InlineCode>
              <StateBadge tone={state.boundaryCheck.result ? "new" : "neutral"}>
                {String(state.boundaryCheck.result)}
              </StateBadge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not checked yet.</p>
          )}
        </div>
      </div>

      <ArrayVisualizer
        label="RESULT ARRAY"
        badge="NEW"
        emptyHint="[] — nothing collected yet"
        items={state.result.map((v, i) => ({ id: `r-${i}`, label: String(v), status: "added" }))}
      />

      {state.isFinal && state.capped && (
        <p className="text-xs text-muted-foreground">Capped at {MAX_ITEMS} items.</p>
      )}
    </div>
  );
}
