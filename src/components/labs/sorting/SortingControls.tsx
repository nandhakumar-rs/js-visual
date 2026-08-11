"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { SortingInputs, SortingStepState, SortMode } from "./types";

const MODES: { value: SortMode; label: string }[] = [
  { value: "default", label: "sort() — no comparator" },
  { value: "numeric", label: "sort((a,b) => a-b)" },
  { value: "immutable", label: "toSorted((a,b) => a-b)" },
];

function parseList(text: string): number[] {
  return text
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

export function SortingControls({ inputs, onInputsChange }: LabControlsProps<SortingInputs, SortingStepState>) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="sort-array">Numbers</Label>
        <Input
          id="sort-array"
          defaultValue={inputs.array.join(", ")}
          onBlur={(e) => onInputsChange({ ...inputs, array: parseList(e.target.value) })}
        />
      </div>
      <div role="radiogroup" aria-label="Sort method" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={inputs.mode === m.value}
            onClick={() => onInputsChange({ ...inputs, mode: m.value })}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-xs transition-colors sm:text-sm",
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
  );
}
