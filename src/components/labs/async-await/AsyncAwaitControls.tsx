"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { AsyncAwaitInputs, AsyncAwaitStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["top-to-bottom", "not-blocking", "fails", "all-together"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "top-to-bottom": "Two steps, in order",
  "not-blocking": "await doesn't block",
  fails: "One try/catch",
  "all-together": "All together",
};

export function AsyncAwaitControls({
  inputs,
  onInputsChange,
}: LabControlsProps<AsyncAwaitInputs, AsyncAwaitStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        The same asynchronous work, written as ordinary statements.
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
