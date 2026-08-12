"use client";

import type { LabControlsProps } from "@/types/lab";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { ClosuresInputs, ClosuresStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["one-counter", "two-counters", "from-outside"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "one-counter": "One counter",
  "two-counters": "Two counters",
  "from-outside": "Reading count from outside",
};

export function ClosuresControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ClosuresInputs, ClosuresStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Step through what happens to count when createCounter() finishes.
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
