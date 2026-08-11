"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { SortingInputs, SortingStepState, SortMode } from "./types";

const MODES: { value: SortMode; label: string; description: string }[] = [
  { value: "default", label: "Default", description: "Default — text order" },
  { value: "asc", label: "Ascending", description: "Ascending — a - b" },
  { value: "desc", label: "Descending", description: "Descending — b - a" },
  { value: "immutable", label: "Immutable", description: "Immutable — toSorted()" },
];

const DEFAULT_INPUTS: SortingInputs = { values: [10, 1, 2, 20], mode: "default" };
const DEFAULT_TEXT = "10, 1, 2, 20";

function parseValues(text: string): { values: number[] } | { error: string } {
  const trimmed = text.trim();
  if (trimmed === "") return { error: "Enter at least one number" };
  const values: number[] = [];
  for (const token of trimmed.split(",").map((t) => t.trim())) {
    if (token === "") continue;
    const n = Number(token);
    if (Number.isNaN(n)) return { error: `"${token}" isn't a number` };
    values.push(n);
  }
  if (values.length === 0) return { error: "Enter at least one number" };
  return { values };
}

export function SortingControls({
  inputs,
  onInputsChange,
  engine,
}: LabControlsProps<SortingInputs, SortingStepState>) {
  const [text, setText] = useState(inputs.values.join(", "));
  const [error, setError] = useState<string | null>(null);

  function commit(value: string) {
    const result = parseValues(value);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    onInputsChange({ ...inputs, values: result.values });
  }

  function handleResetDefaults() {
    setText(DEFAULT_TEXT);
    setError(null);
    onInputsChange(DEFAULT_INPUTS);
    engine.setSpeed(1);
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="w-48 space-y-1">
        <Label htmlFor="sort-values">Numbers to sort</Label>
        <Input
          id="sort-values"
          value={text}
          aria-invalid={error ? true : undefined}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="space-y-1">
        <Label>How should we sort them?</Label>
        <div
          role="radiogroup"
          aria-label="How should we sort them?"
          aria-describedby="sort-mode-description"
          className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5"
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={inputs.mode === m.value}
              onClick={() => onInputsChange({ ...inputs, mode: m.value })}
              className={cn(
                "rounded-md px-3 py-1 text-sm transition-colors",
                inputs.mode === m.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p id="sort-mode-description" className="text-xs text-muted-foreground">
          {MODES.find((m) => m.value === inputs.mode)?.description}
        </p>
      </div>

      <div className="space-y-1">
        <div className="h-3.5" aria-hidden />
        <Button variant="outline" size="default" onClick={handleResetDefaults} className="gap-1.5">
          <RotateCcw className="size-4" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
