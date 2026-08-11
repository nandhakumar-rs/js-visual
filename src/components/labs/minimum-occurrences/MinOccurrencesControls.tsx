"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { MinOccurrencesInputs, MinOccurrencesStepState } from "./types";

function parseList(text: string): number[] {
  return text
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

export function MinOccurrencesControls({
  inputs,
  onInputsChange,
}: LabControlsProps<MinOccurrencesInputs, MinOccurrencesStepState>) {
  return (
    <div className="max-w-xs space-y-1">
      <Label htmlFor="min-occ-array">Array</Label>
      <Input
        id="min-occ-array"
        defaultValue={inputs.array.join(", ")}
        onBlur={(e) => {
          const parsed = parseList(e.target.value);
          if (parsed.length > 0) onInputsChange({ array: parsed });
        }}
      />
    </div>
  );
}
