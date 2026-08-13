"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { DeepComparisonInputs, DeepComparisonStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["shallow-vs-deep", "walk", "mismatch", "all-together"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "shallow-vs-deep": "Shallow said no",
  walk: "Walking down",
  mismatch: "Where it fails",
  "all-together": "All together",
};

export function DeepComparisonControls({
  inputs,
  onInputsChange,
}: LabControlsProps<DeepComparisonInputs, DeepComparisonStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        The same check, applied again to whatever it finds inside.
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
