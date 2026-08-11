"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { DedupInputs, DedupMethod, DedupStepState } from "./types";

const METHODS: { value: DedupMethod; label: string }[] = [
  { value: "set", label: "Set" },
  { value: "filter", label: "filter" },
  { value: "reduce", label: "reduce" },
];

function parseList(text: string): number[] {
  return text
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

export function DedupControls({ inputs, onInputsChange }: LabControlsProps<DedupInputs, DedupStepState>) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <Label htmlFor="dedup-array">Array</Label>
        <Input
          id="dedup-array"
          defaultValue={inputs.array.join(", ")}
          onBlur={(e) => onInputsChange({ ...inputs, array: parseList(e.target.value) })}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Method</p>
        <div role="radiogroup" aria-label="Method" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={inputs.method === m.value}
              onClick={() => onInputsChange({ ...inputs, method: m.value })}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-sm transition-colors",
                inputs.method === m.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
