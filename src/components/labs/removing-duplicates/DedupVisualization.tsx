"use client";

import { ArrayVisualizer, type ArrayItemStatus } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { DedupInputs, DedupItemStatus, DedupMethod, DedupStepState } from "./types";

const STATUS_MAP: Record<DedupItemStatus, ArrayItemStatus> = {
  waiting: "default",
  checking: "active",
  kept: "match",
  skipped: "reject",
};

const SUBLABEL_MAP: Record<DedupItemStatus, string> = {
  waiting: "WAITING",
  checking: "CHECKING",
  kept: "KEPT",
  skipped: "DUPLICATE — SKIPPED",
};

const EMPTY_STATE: DedupStepState = {
  itemStatuses: [],
  resultValues: [],
  isFinal: false,
  currentIndex: -1,
  currentIsDuplicate: false,
};

function CurrentCheck({
  method,
  value,
  index,
  values,
  isDuplicate,
}: {
  method: DedupMethod;
  value: number;
  index: number;
  values: number[];
  isDuplicate: boolean;
}) {
  if (method === "filter") {
    const firstIndex = values.indexOf(value);
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
        <InlineCode>{`values.indexOf(${value})`}</InlineCode>
        <span className="text-muted-foreground">→</span>
        <span>{firstIndex}</span>
        <span className="mx-1 text-muted-foreground">·</span>
        <span className="text-muted-foreground">current index →</span>
        <span>{index}</span>
        <span className="text-muted-foreground">→</span>
        <StateBadge tone={isDuplicate ? "neutral" : "new"}>{isDuplicate ? "skip" : "keep"}</StateBadge>
      </div>
    );
  }

  const expression = method === "set" ? `Set.has(${value})` : `result.includes(${value})`;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
      <InlineCode>{expression}</InlineCode>
      <span className="text-muted-foreground">→</span>
      <StateBadge tone={isDuplicate ? "neutral" : "new"}>{String(isDuplicate)}</StateBadge>
    </div>
  );
}

export function DedupVisualization({ step, inputs }: LabVisualizationProps<DedupInputs, DedupStepState>) {
  const state = step?.state ?? EMPTY_STATE;
  const showSetContainer = inputs.method === "set";
  const isChecking = state.currentIndex !== -1;

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="ORIGINAL ARRAY"
        items={inputs.values.map((v, i) => ({
          id: `v-${i}`,
          label: String(v),
          status: STATUS_MAP[state.itemStatuses[i] ?? "waiting"],
          sublabel: SUBLABEL_MAP[state.itemStatuses[i] ?? "waiting"],
        }))}
      />

      {showSetContainer && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">SET — UNIQUE VALUES</p>
          <div className="rounded-lg border border-border bg-card/50 p-3 font-mono text-sm">
            {state.resultValues.length > 0
              ? `Set(${state.resultValues.length}) { ${state.resultValues.join(", ")} }`
              : "Set(0) { }"}
          </div>
        </div>
      )}

      {!state.isFinal && isChecking && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">CURRENT CHECK</p>
          <CurrentCheck
            method={inputs.method}
            value={inputs.values[state.currentIndex]}
            index={state.currentIndex}
            values={inputs.values}
            isDuplicate={state.currentIsDuplicate}
          />
        </div>
      )}

      <ArrayVisualizer
        label="NEW UNIQUE ARRAY"
        badge="NEW"
        emptyHint="Nothing created yet."
        items={state.resultValues.map((v, i) => ({ id: `r-${i}`, label: String(v), status: "added" }))}
      />

      {state.isFinal && inputs.method === "set" && (
        <div className="space-y-1 rounded-lg border border-dashed border-border bg-muted/20 p-2.5 text-center">
          <p className="text-[0.65rem] font-medium text-muted-foreground">ONE-LINE EQUIVALENT</p>
          <InlineCode>const unique = [...new Set(values)];</InlineCode>
        </div>
      )}
    </div>
  );
}
