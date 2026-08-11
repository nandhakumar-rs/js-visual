"use client";

import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { HighlightInputs, HighlightStepState } from "./types";

export function HighlightControls({
  inputs,
  onInputsChange,
}: LabControlsProps<HighlightInputs, HighlightStepState>) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="highlight-text">Text</Label>
        <Textarea
          id="highlight-text"
          defaultValue={inputs.text}
          onBlur={(e) => onInputsChange({ ...inputs, text: e.target.value })}
          rows={3}
        />
      </div>
      <div className="max-w-xs space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="highlight-threshold">Highlight words longer than</Label>
          <span className="tabular-nums text-muted-foreground">{inputs.threshold}</span>
        </div>
        <Slider
          id="highlight-threshold"
          min={2}
          max={12}
          step={1}
          value={[inputs.threshold]}
          onValueChange={(vals) => onInputsChange({ ...inputs, threshold: Array.isArray(vals) ? vals[0] : vals })}
        />
      </div>
    </div>
  );
}
