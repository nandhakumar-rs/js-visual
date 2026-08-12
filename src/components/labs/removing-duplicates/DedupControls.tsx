"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { DedupInputs, DedupMethod, DedupStepState } from "./types";

const METHODS: readonly DedupMethod[] = ["set", "filter", "reduce"];

const METHOD_LABEL: Record<DedupMethod, string> = {
  set: "Set",
  filter: "filter",
  reduce: "reduce",
};

const METHOD_DESCRIPTION: Record<DedupMethod, string> = {
  set: "Set — keep one of each",
  filter: "filter — keep first occurrences",
  reduce: "reduce — build the result manually",
};

const DEFAULT_INPUTS: DedupInputs = { values: [1, 2, 2, 3, 1], method: "set" };
const DEFAULT_TEXT = "1, 2, 2, 3, 1";

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

export function DedupControls({ inputs, onInputsChange, engine }: LabControlsProps<DedupInputs, DedupStepState>) {
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
        <Label htmlFor="dedup-values">Numbers to clean</Label>
        <Input
          id="dedup-values"
          value={text}
          aria-invalid={error ? true : undefined}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <SegmentedControl
        label="How should we remove repeats?"
        size="md"
        labelAs="label"
        options={METHODS}
        value={inputs.method}
        onChange={(method) => onInputsChange({ ...inputs, method })}
        optionLabel={(method) => METHOD_LABEL[method]}
        description={METHOD_DESCRIPTION[inputs.method]}
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
