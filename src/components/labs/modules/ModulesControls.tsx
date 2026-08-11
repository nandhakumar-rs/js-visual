"use client";

import { cn } from "@/lib/utils";
import type { LabControlsProps } from "@/types/lab";
import type { ExportStyle, ModulesInputs, ModulesStepState } from "./types";

const STYLES: { value: ExportStyle; label: string }[] = [
  { value: "named", label: "Named Export" },
  { value: "default", label: "Default Export" },
];

export function ModulesControls({ inputs, onInputsChange }: LabControlsProps<ModulesInputs, ModulesStepState>) {
  return (
    <div role="radiogroup" aria-label="Export style" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
      {STYLES.map((s) => (
        <button
          key={s.value}
          type="button"
          role="radio"
          aria-checked={inputs.exportStyle === s.value}
          onClick={() => onInputsChange({ exportStyle: s.value })}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            inputs.exportStyle === s.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
