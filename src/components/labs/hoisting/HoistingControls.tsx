"use client";

import { cn } from "@/lib/utils";
import type { LabControlsProps } from "@/types/lab";
import type { DeclarationType, HoistingInputs, HoistingStepState } from "./types";

const OPTIONS: DeclarationType[] = ["var", "let", "const", "function"];

export function HoistingControls({
  inputs,
  onInputsChange,
}: LabControlsProps<HoistingInputs, HoistingStepState>) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Declaration type</p>
      <div role="radiogroup" aria-label="Declaration type" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {OPTIONS.map((option) => {
          const isActive = inputs.declarationType === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onInputsChange({ declarationType: option })}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-sm transition-colors",
                isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
