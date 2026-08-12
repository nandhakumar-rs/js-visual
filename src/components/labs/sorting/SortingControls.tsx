"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { SortingInputs, SortingStepState, SortMode } from "./types";

const MODES: readonly SortMode[] = ["default", "asc", "desc", "immutable"];

const MODE_LABEL: Record<SortMode, string> = {
  default: "Default",
  asc: "Ascending",
  desc: "Descending",
  immutable: "Immutable",
};

const MODE_DESCRIPTION: Record<SortMode, string> = {
  default: "Default — text order",
  asc: "Ascending — a - b",
  desc: "Descending — b - a",
  immutable: "Immutable — toSorted()",
};

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

      <SegmentedControl
        label="How should we sort them?"
        size="md"
        labelAs="label"
        options={MODES}
        value={inputs.mode}
        onChange={(mode) => onInputsChange({ ...inputs, mode })}
        optionLabel={(mode) => MODE_LABEL[mode]}
        description={MODE_DESCRIPTION[inputs.mode]}
      />

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
