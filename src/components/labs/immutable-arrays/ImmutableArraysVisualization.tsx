"use client";

import { ArrowRight } from "lucide-react";
import { ArrayVisualizer, type ArrayItemState } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type { ValuesRefInputs, ValuesRefStepState } from "./types";

function originalItems(values: number[], active: boolean): ArrayItemState[] {
  return values.map((v, i) => ({ id: `o-${i}`, label: String(v), status: active ? "active" : "default" }));
}

function companionItems(values: number[] | undefined, revealLast: boolean): ArrayItemState[] {
  if (!values) return [];
  return values.map((v, i) => ({
    id: `c-${i}`,
    label: String(v),
    status: revealLast && i === values.length - 1 ? "added" : "default",
  }));
}

function VariableLabel({ children }: { children: string }) {
  return (
    <div className="flex h-7 min-w-[4.75rem] items-center justify-center rounded-md border border-border bg-card px-2 font-mono text-xs text-muted-foreground">
      {children}
    </div>
  );
}

export function ImmutableArraysVisualization({
  step,
}: LabVisualizationProps<ValuesRefInputs, ValuesRefStepState>) {
  const state = step?.state;
  if (!state) return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;

  const { original, originalActive, originalBadge, companion, companionLabel, companionBadge, connector, newIndexRevealed } =
    state;

  if (connector === "shared") {
    return (
      <div className="flex items-stretch gap-2">
        <div className="flex flex-col justify-around gap-1.5">
          <VariableLabel>original</VariableLabel>
          <VariableLabel>{companionLabel ?? "alias"}</VariableLabel>
        </div>
        <div className="flex items-stretch" aria-hidden>
          <div className="w-3 rounded-r-md border-y border-r border-muted-foreground/40" />
        </div>
        <div className="flex items-center">
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <div className="flex-1 space-y-1.5">
          {companionBadge && <StateBadge tone={companionBadge.tone}>{companionBadge.text}</StateBadge>}
          <ArrayVisualizer items={companionItems(companion ?? original, Boolean(newIndexRevealed))} />
        </div>
      </div>
    );
  }

  if (connector === "separate") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <VariableLabel>original</VariableLabel>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="flex-1 space-y-1.5">
            {originalBadge && <StateBadge tone={originalBadge.tone}>{originalBadge.text}</StateBadge>}
            <ArrayVisualizer items={originalItems(original, Boolean(originalActive))} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <VariableLabel>{companionLabel ?? "updated"}</VariableLabel>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="flex-1 space-y-1.5">
            {companionBadge && <StateBadge tone={companionBadge.tone}>{companionBadge.text}</StateBadge>}
            <ArrayVisualizer
              items={companionItems(companion, Boolean(newIndexRevealed))}
              emptyHint={state.companionEmptyHint ?? "Not created yet."}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <VariableLabel>original</VariableLabel>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <ArrayVisualizer items={originalItems(original, false)} />
    </div>
  );
}
