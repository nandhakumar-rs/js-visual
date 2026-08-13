"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { ScenarioId, ShallowComparisonInputs, ShallowComparisonStepState } from "./types";

const OPTIONS: readonly ScenarioId[] = ["look-alikes", "shallow", "nested", "all-together"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "look-alikes": "Same contents",
  shallow: "Key by key",
  nested: "Where it stops",
  "all-together": "All together",
};

export function ShallowComparisonControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ShallowComparisonInputs, ShallowComparisonStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Which object, not which contents &mdash; and where that stops being enough.
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
