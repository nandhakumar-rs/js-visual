"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { ConcatArraysInputs, ConcatArraysStepState, ConcatMode } from "./types";

const MODES: readonly ConcatMode[] = ["concat", "spread"];

const MODE_LABEL: Record<ConcatMode, string> = {
  concat: "concat()",
  spread: "Spread syntax",
};

const DEFAULT_INPUTS: ConcatArraysInputs = { a: [1, 2], b: [3, 4], mode: "concat" };

function parseArrayInput(text: string): { values: number[] } | { error: string } {
  const trimmed = text.trim();
  if (trimmed === "") return { values: [] };
  const values: number[] = [];
  for (const token of trimmed.split(",").map((t) => t.trim())) {
    if (token === "") continue;
    const n = Number(token);
    if (Number.isNaN(n)) return { error: `"${token}" isn't a number` };
    values.push(n);
  }
  return { values };
}

interface ArrayFieldProps {
  id: string;
  label: string;
  defaultText: string;
  error: string | null;
  onCommit: (text: string) => void;
}

// The initial text is captured once via useState (not re-read from
// `defaultText` on every render) so this stays an uncontrolled input that
// only reflects external resets when actually remounted via `key` — base-ui's
// Input warns if an uncontrolled field's `defaultValue` prop appears to
// change after mount, which it otherwise would on every keystroke-triggered
// parent re-render (inputs.a.join(", ") is a freshly computed string each time).
function ArrayField({ id, label, defaultText, error, onCommit }: ArrayFieldProps) {
  const [text] = useState(defaultText);
  return (
    <div className="w-32 space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        defaultValue={text}
        aria-invalid={error ? true : undefined}
        onBlur={(e) => onCommit(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ConcatArraysControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ConcatArraysInputs, ConcatArraysStepState>) {
  const [resetKey, setResetKey] = useState(0);
  const [aError, setAError] = useState<string | null>(null);
  const [bError, setBError] = useState<string | null>(null);

  function handleArrayBlur(key: "a" | "b", text: string) {
    const result = parseArrayInput(text);
    if ("error" in result) {
      (key === "a" ? setAError : setBError)(result.error);
      return;
    }
    (key === "a" ? setAError : setBError)(null);
    onInputsChange({ ...inputs, [key]: result.values });
  }

  function handleResetDefaults() {
    setAError(null);
    setBError(null);
    onInputsChange(DEFAULT_INPUTS);
    setResetKey((k) => k + 1);
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <SegmentedControl
        label="How should we combine the arrays?"
        size="md"
        labelAs="label"
        options={MODES}
        value={inputs.mode}
        onChange={(mode) => onInputsChange({ ...inputs, mode })}
        optionLabel={(mode) => MODE_LABEL[mode]}
      />

      <ArrayField
        key={`a-${resetKey}`}
        id="array-a"
        label="Array a"
        defaultText={inputs.a.join(", ")}
        error={aError}
        onCommit={(text) => handleArrayBlur("a", text)}
      />

      <ArrayField
        key={`b-${resetKey}`}
        id="array-b"
        label="Array b"
        defaultText={inputs.b.join(", ")}
        error={bError}
        onCommit={(text) => handleArrayBlur("b", text)}
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
