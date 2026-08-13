"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { MicrotaskInputs, MicrotaskStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["rule", "drain", "between", "all-together"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  rule: ".then vs setTimeout",
  drain: "Draining the whole queue",
  between: "Between every task",
  "all-together": "All together",
};

export function MicrotaskControls({
  inputs,
  onInputsChange,
}: LabControlsProps<MicrotaskInputs, MicrotaskStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">Two queues, and the one that always goes first.</p>
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
