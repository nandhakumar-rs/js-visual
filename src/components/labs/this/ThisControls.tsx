"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { ThisInputs, ThisScenario, ThisStepState } from "./types";

const SCENARIOS: readonly ThisScenario[] = [
  "object-method",
  "regular-function",
  "arrow-function",
  "class-method",
  "detached-method",
];

const SCENARIO_LABEL: Record<ThisScenario, string> = {
  "object-method": "Object Method",
  "regular-function": "Regular Function",
  "arrow-function": "Arrow Function",
  "class-method": "Class Method",
  "detached-method": "Detached Method",
};

export function ThisControls({ inputs, onInputsChange }: LabControlsProps<ThisInputs, ThisStepState>) {
  return (
    <div className="space-y-3">
      <SegmentedControl
        label="Scenario"
        size="md"
        labelAs="none"
        options={SCENARIOS}
        value={inputs.scenario}
        onChange={(scenario) => onInputsChange({ ...inputs, scenario })}
        optionLabel={(scenario) => SCENARIO_LABEL[scenario]}
      />

      {inputs.scenario === "detached-method" && (
        <div className="flex items-center gap-2">
          <Switch
            id="use-bind"
            checked={inputs.useBind}
            onCheckedChange={(checked) => onInputsChange({ ...inputs, useBind: checked })}
          />
          <Label htmlFor="use-bind">Fix it with .bind(person)</Label>
        </div>
      )}
    </div>
  );
}
