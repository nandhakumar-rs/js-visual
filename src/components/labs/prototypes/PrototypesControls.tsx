"use client";

import { cn } from "@/lib/utils";
import type { LabControlsProps } from "@/types/lab";
import type { LookupProperty, PrototypesInputs, PrototypesStepState } from "./types";

const PROPERTIES: { value: LookupProperty; label: string }[] = [
  { value: "name", label: "name" },
  { value: "greet", label: "greet" },
  { value: "toString", label: "toString" },
  { value: "madeUp", label: "madeUp (doesn't exist)" },
];

export function PrototypesControls({
  inputs,
  onInputsChange,
}: LabControlsProps<PrototypesInputs, PrototypesStepState>) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Look up maya.</p>
      <div role="radiogroup" aria-label="Property to look up" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {PROPERTIES.map((p) => (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={inputs.property === p.value}
            onClick={() => onInputsChange({ property: p.value })}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-sm transition-colors",
              inputs.property === p.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
