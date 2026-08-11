"use client";

import { cn } from "@/lib/utils";
import type { LabControlsProps } from "@/types/lab";
import type { CallbackToPromiseInputs, CallbackToPromiseStepState, ConversionStyle } from "./types";

const STYLES: { value: ConversionStyle; label: string }[] = [
  { value: "callback", label: "Callback" },
  { value: "promise", label: "Promise" },
];

export function CallbackToPromiseControls({
  inputs,
  onInputsChange,
}: LabControlsProps<CallbackToPromiseInputs, CallbackToPromiseStepState>) {
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Style" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {STYLES.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={inputs.style === s.value}
            onClick={() => onInputsChange({ style: s.value })}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              inputs.style === s.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">Convert →</span>
    </div>
  );
}
