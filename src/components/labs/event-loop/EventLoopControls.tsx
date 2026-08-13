"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { EventLoopInputs, EventLoopStepState, ScenarioId } from "./types";

const OPTIONS: readonly ScenarioId[] = ["zero-timeout", "two-timers", "busy-stack", "all-together"];

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  "zero-timeout": "setTimeout(fn, 0)",
  "two-timers": "Two timers",
  "busy-stack": "A busy stack",
  "all-together": "All together",
};

export function EventLoopControls({
  inputs,
  onInputsChange,
}: LabControlsProps<EventLoopInputs, EventLoopStepState>) {
  return (
    <div className="@container space-y-2">
      <p className="text-xs text-muted-foreground">
        Where your callback waits, and what decides when it runs.
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
