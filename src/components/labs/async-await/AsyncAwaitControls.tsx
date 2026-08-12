"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { AsyncAwaitInputs, AsyncAwaitStepState, AsyncStyle } from "./types";

const STYLES: readonly AsyncStyle[] = ["promises", "async-await"];

const STYLE_LABEL: Record<AsyncStyle, string> = {
  promises: "Promises",
  "async-await": "Async / Await",
};

export function AsyncAwaitControls({
  inputs,
  onInputsChange,
}: LabControlsProps<AsyncAwaitInputs, AsyncAwaitStepState>) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SegmentedControl
        label="Code style"
        size="md"
        labelAs="none"
        options={STYLES}
        value={inputs.style}
        onChange={(style) => onInputsChange({ ...inputs, style })}
        optionLabel={(style) => STYLE_LABEL[style]}
      />
      <div className="flex items-center gap-2">
        <Switch
          id="async-statuses-fail"
          checked={inputs.statusesFail}
          onCheckedChange={(checked) => onInputsChange({ ...inputs, statusesFail: checked })}
        />
        <Label htmlFor="async-statuses-fail">Make getStatuses() fail</Label>
      </div>
    </div>
  );
}
