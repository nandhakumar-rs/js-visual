"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { CallbacksInputs, CallbacksStepState } from "./types";

export function CallbacksControls({
  inputs,
  onInputsChange,
}: LabControlsProps<CallbacksInputs, CallbacksStepState>) {
  return (
    <div className="max-w-xs space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <Label htmlFor="callback-delay">Simulated delay</Label>
        <span className="tabular-nums text-muted-foreground">{inputs.delayMs}ms</span>
      </div>
      <Slider
        id="callback-delay"
        min={200}
        max={3000}
        step={100}
        value={[inputs.delayMs]}
        onValueChange={(vals) => onInputsChange({ delayMs: Array.isArray(vals) ? vals[0] : vals })}
      />
    </div>
  );
}
