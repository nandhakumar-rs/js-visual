"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { RangeInputs, RangeStepState } from "./types";

const DEFAULT_INPUTS: RangeInputs = { start: 2, end: 8, step: 1 };
const MAX_ITEMS = 100;

function parseIntegerField(text: string, opts?: { rejectZero?: string }): { value: number } | { error: string } {
  const trimmed = text.trim();
  if (trimmed === "") return { error: "Enter a number" };
  const n = Number(trimmed);
  if (Number.isNaN(n)) return { error: `"${trimmed}" isn't a number` };
  if (!Number.isInteger(n)) return { error: "Enter a whole number" };
  if (opts?.rejectZero && n === 0) return { error: opts.rejectZero };
  return { value: n };
}

function predictCount(start: number, end: number, step: number): number {
  if (step === 0) return 0;
  if (step > 0) return start >= end ? 0 : Math.ceil((end - start) / step);
  return start <= end ? 0 : Math.ceil((start - end) / -step);
}

interface NumberFieldProps {
  id: string;
  label: string;
  text: string;
  error: string | null;
  onChange: (text: string) => void;
  onBlur: (text: string) => void;
}

function NumberField({ id, label, text, error, onChange, onBlur }: NumberFieldProps) {
  return (
    <div className="w-24 space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={text}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function RangeControls({ inputs, onInputsChange, engine }: LabControlsProps<RangeInputs, RangeStepState>) {
  const [startText, setStartText] = useState(String(inputs.start));
  const [endText, setEndText] = useState(String(inputs.end));
  const [stepText, setStepText] = useState(String(inputs.step));
  const [startError, setStartError] = useState<string | null>(null);
  const [endError, setEndError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  function commitStart(text: string) {
    const result = parseIntegerField(text);
    if ("error" in result) {
      setStartError(result.error);
      return;
    }
    setStartError(null);
    onInputsChange({ ...inputs, start: result.value });
  }

  function commitEnd(text: string) {
    const result = parseIntegerField(text);
    if ("error" in result) {
      setEndError(result.error);
      return;
    }
    setEndError(null);
    onInputsChange({ ...inputs, end: result.value });
  }

  function commitStep(text: string) {
    const result = parseIntegerField(text, { rejectZero: "Step cannot be 0 because the range would never advance." });
    if ("error" in result) {
      setStepError(result.error);
      return;
    }
    setStepError(null);
    onInputsChange({ ...inputs, step: result.value });
  }

  function handleResetDefaults() {
    setStartText(String(DEFAULT_INPUTS.start));
    setEndText(String(DEFAULT_INPUTS.end));
    setStepText(String(DEFAULT_INPUTS.step));
    setStartError(null);
    setEndError(null);
    setStepError(null);
    onInputsChange(DEFAULT_INPUTS);
    engine.setSpeed(1);
  }

  const predictedCount = predictCount(inputs.start, inputs.end, inputs.step);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-start gap-4">
        <NumberField
          id="range-start"
          label="Start"
          text={startText}
          error={startError}
          onChange={setStartText}
          onBlur={commitStart}
        />
        <NumberField id="range-end" label="End" text={endText} error={endError} onChange={setEndText} onBlur={commitEnd} />
        <NumberField
          id="range-step"
          label="Step"
          text={stepText}
          error={stepError}
          onChange={setStepText}
          onBlur={commitStep}
        />

        <div className="space-y-1">
          <div className="h-3.5" aria-hidden />
          <Button variant="outline" size="default" onClick={handleResetDefaults} className="gap-1.5">
            <RotateCcw className="size-4" />
            Reset to defaults
          </Button>
        </div>
      </div>

      {predictedCount > MAX_ITEMS && (
        <p className="text-xs text-muted-foreground">
          This range would generate {predictedCount} values — only the first {MAX_ITEMS} will be shown.
        </p>
      )}
    </div>
  );
}
