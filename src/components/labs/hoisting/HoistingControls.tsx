"use client";

import type { LabControlsProps } from "@/types/lab";
import { SegmentedControl } from "./SegmentedControl";
import type { HoistingInputs, HoistingStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["var", "let-const", "function"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  var: "var",
  "let-const": "let / const",
  function: "function declaration",
};

export function HoistingControls({
  inputs,
  onInputsChange,
}: LabControlsProps<HoistingInputs, HoistingStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Step through how JavaScript prepares and then runs each kind of declaration.
      </p>
      <SegmentedControl
        label="Scenario"
        options={OPTIONS}
        value={inputs.scenario}
        onChange={(scenario) => onInputsChange({ scenario })}
        optionLabel={(option) => SCENARIO_LABEL[option]}
        mono
      />
    </div>
  );
}
