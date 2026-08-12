"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { XhrInputs, XhrStepState } from "./types";

// `willSucceed` is a boolean, but SegmentedControl keys options by string, so
// the two are mapped at this boundary rather than loosening the component.
type Outcome = "succeeds" | "fails";

const OUTCOMES: readonly Outcome[] = ["succeeds", "fails"];

const OUTCOME_LABEL: Record<Outcome, string> = {
  succeeds: "Request succeeds",
  fails: "Request fails",
};

export function XhrControls({ inputs, onInputsChange }: LabControlsProps<XhrInputs, XhrStepState>) {
  return (
    <SegmentedControl
      label="Request outcome"
      size="md"
      labelAs="none"
      options={OUTCOMES}
      value={inputs.willSucceed ? "succeeds" : "fails"}
      onChange={(outcome) => onInputsChange({ willSucceed: outcome === "succeeds" })}
      optionLabel={(outcome) => OUTCOME_LABEL[outcome]}
    />
  );
}
