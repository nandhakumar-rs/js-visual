"use client";

import { cn } from "@/lib/utils";
import type { LabVisualizationProps } from "@/types/lab";
import type { MemoizationInputs, MemoizationStepState } from "./types";

export function MemoizationVisualization({
  step,
}: LabVisualizationProps<MemoizationInputs, MemoizationStepState>) {
  const state = step?.state ?? { cache: [], calls: 0, calculations: 0, cacheHits: 0 };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-md border border-border bg-muted/30 p-2">
          <p className="text-lg font-semibold tabular-nums">{state.calls}</p>
          <p className="text-xs text-muted-foreground">Calls</p>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-2">
          <p className="text-lg font-semibold tabular-nums">{state.calculations}</p>
          <p className="text-xs text-muted-foreground">Calculations</p>
        </div>
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2">
          <p className="text-lg font-semibold tabular-nums">{state.cacheHits}</p>
          <p className="text-xs text-muted-foreground">Cache hits</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-1.5 text-left font-medium">Input</th>
              <th className="px-3 py-1.5 text-left font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {state.cache.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-3 py-3 text-center text-xs italic text-muted-foreground">
                  Cache is empty.
                </td>
              </tr>
            ) : (
              state.cache.map((entry) => (
                <tr
                  key={entry.input}
                  className={cn(
                    "border-t border-border/60",
                    state.lastInput === entry.input && "bg-primary/5"
                  )}
                >
                  <td className="px-3 py-1.5 font-mono">{entry.input}</td>
                  <td className="px-3 py-1.5 font-mono">{entry.result}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
