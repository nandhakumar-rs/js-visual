"use client";

import { ArrowDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHAIN } from "./types";
import type { LabVisualizationProps } from "@/types/lab";
import type { PrototypesInputs, PrototypesStepState } from "./types";

export function PrototypesVisualization({
  step,
}: LabVisualizationProps<PrototypesInputs, PrototypesStepState>) {
  const state = step?.state ?? { checkedLevelIds: [], reachedNull: false };

  return (
    <div className="flex flex-col items-center gap-1">
      {CHAIN.map((level, i) => {
        const isChecked = state.checkedLevelIds.includes(level.id);
        const isFound = state.foundAtLevelId === level.id;
        return (
          <div key={level.id} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm",
                isFound
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : isChecked
                    ? "border-border bg-muted/40 opacity-70"
                    : "border-border bg-card"
              )}
            >
              {level.label}
              {isChecked && (isFound ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <X className="size-3.5 text-muted-foreground" />)}
            </div>
            {i < CHAIN.length - 1 && (
              <div className="flex flex-col items-center text-[0.65rem] text-muted-foreground">
                <span>[[Prototype]]</span>
                <ArrowDown className="size-3.5" aria-hidden />
              </div>
            )}
          </div>
        );
      })}
      <div className="flex flex-col items-center text-[0.65rem] text-muted-foreground">
        <span>[[Prototype]]</span>
        <ArrowDown className="size-3.5" aria-hidden />
      </div>
      <div
        className={cn(
          "rounded-md border px-3 py-1.5 font-mono text-sm",
          state.reachedNull ? "border-amber-500/50 bg-amber-500/10" : "border-border bg-card"
        )}
      >
        null
      </div>
    </div>
  );
}
