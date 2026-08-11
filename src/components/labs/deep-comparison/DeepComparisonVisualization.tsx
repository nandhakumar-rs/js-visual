"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabVisualizationProps } from "@/types/lab";
import type { DeepComparisonInputs, DeepComparisonStepState } from "./types";

export function DeepComparisonVisualization({
  step,
}: LabVisualizationProps<DeepComparisonInputs, DeepComparisonStepState>) {
  const state = step?.state ?? { checked: [], comparisons: 0 };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="font-mono text-sm text-muted-foreground">root</p>
        <div className="ml-4 space-y-1 border-l border-border/60 pl-3">
          {state.checked.map((node) => (
            <div
              key={node.path}
              className={cn(
                "flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-sm",
                state.activePath === node.path && "bg-primary/10 ring-1 ring-primary/30"
              )}
            >
              {node.match ? <Check className="size-3.5 text-emerald-500" /> : <X className="size-3.5 text-destructive" />}
              {node.path}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Comparisons performed: <span className="font-mono font-semibold text-foreground">{state.comparisons}</span>
      </p>
      {state.result !== undefined && (
        <p className="text-sm">
          Result: <span className="font-mono font-semibold">{String(state.result)}</span>
        </p>
      )}
    </div>
  );
}
