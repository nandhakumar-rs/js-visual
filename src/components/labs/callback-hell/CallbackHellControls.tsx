"use client";

import type { LabControlsProps } from "@/types/lab";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { CallbackHellInputs, CallbackHellStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["two-steps", "four-steps", "fails"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "two-steps": "Two steps",
  "four-steps": "Four steps",
  fails: "When a step fails",
};

export function CallbackHellControls({
  inputs,
  onInputsChange,
}: LabControlsProps<CallbackHellInputs, CallbackHellStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Watch what each extra step costs. The code is the same shape every time — there is just more of it.
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
