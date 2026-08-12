"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { CallbackToPromiseInputs, CallbackToPromiseStepState, ConversionStyle } from "./types";

const STYLES: readonly ConversionStyle[] = ["callback", "promise"];

const STYLE_LABEL: Record<ConversionStyle, string> = {
  callback: "Callback",
  promise: "Promise",
};

export function CallbackToPromiseControls({
  inputs,
  onInputsChange,
}: LabControlsProps<CallbackToPromiseInputs, CallbackToPromiseStepState>) {
  return (
    <div className="flex items-center gap-3">
      <SegmentedControl
        label="Style"
        size="md"
        labelAs="none"
        options={STYLES}
        value={inputs.style}
        onChange={(style) => onInputsChange({ style })}
        optionLabel={(style) => STYLE_LABEL[style]}
      />
      <span className="text-xs text-muted-foreground">Convert →</span>
    </div>
  );
}
