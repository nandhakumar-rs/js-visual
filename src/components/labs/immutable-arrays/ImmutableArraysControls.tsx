"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { ValuesRefInputs, ValuesRefMode, ValuesRefStepState } from "./types";

const MODES: { value: ValuesRefMode; label: string }[] = [
  { value: "share-mutate", label: "Share + mutate" },
  { value: "copy-add", label: "Copy + add" },
];

const DEFAULT_INPUTS: ValuesRefInputs = { startingArray: [1, 2, 3], newValue: 4, mode: "share-mutate" };

function parseArrayInput(text: string): { values: number[] } | { error: string } {
  const values: number[] = [];
  for (const token of text.trim().split(",").map((t) => t.trim())) {
    if (token === "") continue;
    const n = Number(token);
    if (Number.isNaN(n)) return { error: `"${token}" isn't a number` };
    values.push(n);
  }
  if (values.length === 0) return { error: "Enter at least one number" };
  return { values };
}

interface ArrayFieldProps {
  defaultText: string;
  error: string | null;
  onCommit: (text: string) => void;
}

// The initial text is captured once via useState (not re-read from
// `defaultText` on every render) so this stays an uncontrolled input that
// only reflects external resets when actually remounted via `key` — base-ui's
// Input warns if an uncontrolled field's `defaultValue` prop appears to
// change after mount, which it otherwise would on every keystroke-triggered
// parent re-render (inputs.startingArray.join(", ") is a freshly computed
// string each time).
function ArrayField({ defaultText, error, onCommit }: ArrayFieldProps) {
  const [text] = useState(defaultText);
  return (
    <div className="w-36 space-y-1">
      <Label htmlFor="starting-array">Starting array</Label>
      <Input
        id="starting-array"
        defaultValue={text}
        aria-invalid={error ? true : undefined}
        onBlur={(e) => onCommit(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ImmutableArraysControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ValuesRefInputs, ValuesRefStepState>) {
  const [resetKey, setResetKey] = useState(0);
  const [arrayError, setArrayError] = useState<string | null>(null);

  function handleArrayBlur(text: string) {
    const result = parseArrayInput(text);
    if ("error" in result) {
      setArrayError(result.error);
      return;
    }
    setArrayError(null);
    onInputsChange({ ...inputs, startingArray: result.values });
  }

  function handleReset() {
    setArrayError(null);
    onInputsChange(DEFAULT_INPUTS);
    setResetKey((k) => k + 1);
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="space-y-1">
        <Label>How should we add the value?</Label>
        <div
          role="radiogroup"
          aria-label="How should we add the value?"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5"
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
      </div>

      <ArrayField
        key={resetKey}
        defaultText={inputs.startingArray.join(", ")}
        error={arrayError}
        onCommit={handleArrayBlur}
      />

      <div className="w-24 space-y-1">
        <Label htmlFor="new-value">New value</Label>
        <Input
          id="new-value"
          type="number"
          value={inputs.newValue}
          onChange={(e) => onInputsChange({ ...inputs, newValue: Number(e.target.value) || 0 })}
        />
      </div>

      <div className="space-y-1">
        <div className="h-3.5" aria-hidden />
        <Button variant="outline" size="default" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="size-4" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
