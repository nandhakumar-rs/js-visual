"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { RangeInputs, RangeStepState } from "./types";

export function RangeControls({ inputs, onInputsChange }: LabControlsProps<RangeInputs, RangeStepState>) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-24 space-y-1">
        <Label htmlFor="range-start">Start</Label>
        <Input
          id="range-start"
          type="number"
          value={inputs.start}
          onChange={(e) => onInputsChange({ ...inputs, start: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="w-24 space-y-1">
        <Label htmlFor="range-end">End</Label>
        <Input
          id="range-end"
          type="number"
          value={inputs.end}
          onChange={(e) => onInputsChange({ ...inputs, end: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="w-24 space-y-1">
        <Label htmlFor="range-step">Step</Label>
        <Input
          id="range-step"
          type="number"
          value={inputs.step}
          onChange={(e) => onInputsChange({ ...inputs, step: Number(e.target.value) || 1 })}
        />
      </div>
    </div>
  );
}
