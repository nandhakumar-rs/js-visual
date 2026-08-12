"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { LookupProperty, PrototypesInputs, PrototypesStepState } from "./types";

const PROPERTIES: readonly LookupProperty[] = ["name", "greet", "toString", "madeUp"];

const PROPERTY_LABEL: Record<LookupProperty, string> = {
  name: "name",
  greet: "greet",
  toString: "toString",
  madeUp: "madeUp (doesn't exist)",
};

export function PrototypesControls({
  inputs,
  onInputsChange,
}: LabControlsProps<PrototypesInputs, PrototypesStepState>) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Look up maya.</p>
      <SegmentedControl
        label="Property to look up"
        size="md"
        labelAs="none"
        options={PROPERTIES}
        value={inputs.property}
        onChange={(property) => onInputsChange({ property })}
        optionLabel={(property) => PROPERTY_LABEL[property]}
        mono
      />
    </div>
  );
}
