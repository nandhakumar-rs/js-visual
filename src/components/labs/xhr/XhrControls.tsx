"use client";

import { cn } from "@/lib/utils";
import type { LabControlsProps } from "@/types/lab";
import type { XhrInputs, XhrStepState } from "./types";

export function XhrControls({ inputs, onInputsChange }: LabControlsProps<XhrInputs, XhrStepState>) {
  return (
    <div role="radiogroup" aria-label="Request outcome" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
      {[
        { value: true, label: "Request succeeds" },
        { value: false, label: "Request fails" },
      ].map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          role="radio"
          aria-checked={inputs.willSucceed === opt.value}
          onClick={() => onInputsChange({ willSucceed: opt.value })}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            inputs.willSucceed === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
