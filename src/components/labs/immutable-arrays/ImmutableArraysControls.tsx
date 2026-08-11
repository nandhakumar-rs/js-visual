"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { ImmutableArrayInputs, ImmutableArrayStepState, MutationMode } from "./types";

const MODES: { value: MutationMode; label: string }[] = [
  { value: "push", label: "array.push()" },
  { value: "spread", label: "[...array, x]" },
];

export function ImmutableArraysControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ImmutableArrayInputs, ImmutableArrayStepState>) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Operation</p>
        <div role="radiogroup" aria-label="Operation" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={inputs.mode === m.value}
              onClick={() => onInputsChange({ ...inputs, mode: m.value })}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-sm transition-colors",
                inputs.mode === m.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-24 space-y-1">
        <Label htmlFor="new-value">New value</Label>
        <Input
          id="new-value"
          type="number"
          value={inputs.newValue}
          onChange={(e) => onInputsChange({ ...inputs, newValue: Number(e.target.value) || 0 })}
        />
      </div>
    </div>
  );
}
