"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { PromiseAllInputs, PromiseAllStepState } from "./types";

export function PromiseAllControls({
  inputs,
  onInputsChange,
}: LabControlsProps<PromiseAllInputs, PromiseAllStepState>) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="statuses-fail"
        checked={inputs.statusesFail}
        onCheckedChange={(checked) => onInputsChange({ statusesFail: checked })}
      />
      <Label htmlFor="statuses-fail">Make getStatuses() fail</Label>
    </div>
  );
}
