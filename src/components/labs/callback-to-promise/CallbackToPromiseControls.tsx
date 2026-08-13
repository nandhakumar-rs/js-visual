"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { PromisesInputs, PromisesStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["value", "chain", "fails"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  value: "A promise is a value",
  chain: "Chaining the steps",
  fails: "When a step fails",
};

export function CallbackToPromiseControls({
  inputs,
  onInputsChange,
}: LabControlsProps<PromisesInputs, PromisesStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        The same three steps as the last lesson, without the pyramid.
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
