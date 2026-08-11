"use client";

import { cn } from "@/lib/utils";
import type { LabControlsProps } from "@/types/lab";
import type { AsyncTaskMode, ParallelAsyncInputs, ParallelAsyncStepState } from "./types";

const MODES: { value: AsyncTaskMode; label: string }[] = [
  { value: "sequential", label: "Sequential (await one at a time)" },
  { value: "parallel", label: "Parallel (Promise.all)" },
];

export function ParallelAsyncControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ParallelAsyncInputs, ParallelAsyncStepState>) {
  return (
    <div role="radiogroup" aria-label="Execution mode" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          role="radio"
          aria-checked={inputs.mode === m.value}
          onClick={() => onInputsChange({ mode: m.value })}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            inputs.mode === m.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
