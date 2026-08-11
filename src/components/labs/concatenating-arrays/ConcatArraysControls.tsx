"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { ConcatArraysInputs, ConcatArraysStepState, ConcatMode } from "./types";

function parseList(text: string): number[] {
  return text
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

const MODES: { value: ConcatMode; label: string }[] = [
  { value: "concat", label: "a.concat(b)" },
  { value: "spread", label: "[...a, ...b]" },
];

export function ConcatArraysControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ConcatArraysInputs, ConcatArraysStepState>) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label htmlFor="array-a">Array a</Label>
          <Input
            id="array-a"
            defaultValue={inputs.a.join(", ")}
            onBlur={(e) => onInputsChange({ ...inputs, a: parseList(e.target.value) })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="array-b">Array b</Label>
          <Input
            id="array-b"
            defaultValue={inputs.b.join(", ")}
            onBlur={(e) => onInputsChange({ ...inputs, b: parseList(e.target.value) })}
          />
        </div>
      </div>
      <div role="radiogroup" aria-label="Combine method" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
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
  );
}
