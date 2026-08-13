"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { MemoizationInputs, MemoizationStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["hit-and-miss", "the-key", "when-it-hurts", "all-together"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "hit-and-miss": "Hit and miss",
  "the-key": "What is the key?",
  "when-it-hurts": "When it hurts",
  "all-together": "All together",
};

export function MemoizationControls({
  inputs,
  onInputsChange,
}: LabControlsProps<MemoizationInputs, MemoizationStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Remember the answer &mdash; if you can say what the question was.
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
