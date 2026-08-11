"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { DeepComparisonInputs, DeepComparisonStepState } from "./types";

export function DeepComparisonControls({
  inputs,
  onInputsChange,
}: LabControlsProps<DeepComparisonInputs, DeepComparisonStepState>) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <Label htmlFor="deep-name-a">a.name</Label>
        <Input id="deep-name-a" value={inputs.nameA} onChange={(e) => onInputsChange({ ...inputs, nameA: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="deep-name-b">b.name</Label>
        <Input id="deep-name-b" value={inputs.nameB} onChange={(e) => onInputsChange({ ...inputs, nameB: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="deep-city-a">a.address.city</Label>
        <Input id="deep-city-a" value={inputs.cityA} onChange={(e) => onInputsChange({ ...inputs, cityA: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="deep-city-b">b.address.city</Label>
        <Input id="deep-city-b" value={inputs.cityB} onChange={(e) => onInputsChange({ ...inputs, cityB: e.target.value })} />
      </div>
    </div>
  );
}
