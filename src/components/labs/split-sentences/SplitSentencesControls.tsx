"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { SplitSentencesInputs, SplitSentencesStepState } from "./types";

export function SplitSentencesControls({
  inputs,
  onInputsChange,
}: LabControlsProps<SplitSentencesInputs, SplitSentencesStepState>) {
  return (
    <div className="space-y-1">
      <Label htmlFor="split-text">Paragraph</Label>
      <Textarea
        id="split-text"
        defaultValue={inputs.text}
        onBlur={(e) => onInputsChange({ text: e.target.value })}
        rows={3}
      />
    </div>
  );
}
