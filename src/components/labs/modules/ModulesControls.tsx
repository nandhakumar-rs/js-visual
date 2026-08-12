"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { ExportStyle, ModulesInputs, ModulesStepState } from "./types";

const STYLES: readonly ExportStyle[] = ["named", "default"];

const STYLE_LABEL: Record<ExportStyle, string> = {
  named: "Named Export",
  default: "Default Export",
};

export function ModulesControls({ inputs, onInputsChange }: LabControlsProps<ModulesInputs, ModulesStepState>) {
  return (
    <SegmentedControl
      label="Export style"
      size="md"
      labelAs="none"
      options={STYLES}
      value={inputs.exportStyle}
      onChange={(exportStyle) => onInputsChange({ exportStyle })}
      optionLabel={(style) => STYLE_LABEL[style]}
    />
  );
}
