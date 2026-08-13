"use client";

import type { LabControlsProps } from "@/types/lab";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { CallbacksInputs, CallbacksStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["right-away", "later", "fails"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "right-away": "Called right away",
  later: "Called later",
  fails: "When it fails",
};

export function CallbacksControls({
  inputs,
  onInputsChange,
}: LabControlsProps<CallbacksInputs, CallbacksStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Step through what happens to your function after you hand it over.
      </p>
      <SegmentedControl
        label="Scenario"
        size="md"
        labelAs="label"
        options={OPTIONS}
        value={inputs.scenario}
        onChange={(scenario) => onInputsChange({ scenario })}
        optionLabel={(option) => SCENARIO_LABEL[option]}
      />
    </div>
  );
}
