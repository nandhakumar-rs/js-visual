"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { LabControlsProps } from "@/types/lab";
import type { ShallowComparisonInputs, ShallowComparisonStepState } from "./types";

export function ShallowComparisonControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ShallowComparisonInputs, ShallowComparisonStepState>) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name-a">a.name</Label>
          <Input id="name-a" value={inputs.nameA} onChange={(e) => onInputsChange({ ...inputs, nameA: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="name-b">b.name</Label>
          <Input id="name-b" value={inputs.nameB} onChange={(e) => onInputsChange({ ...inputs, nameB: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="city-a">a.address.city</Label>
          <Input id="city-a" value={inputs.cityA} onChange={(e) => onInputsChange({ ...inputs, cityA: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="city-b">b.address.city</Label>
          <Input
            id="city-b"
            value={inputs.cityB}
            disabled={inputs.shareAddressRef}
            onChange={(e) => onInputsChange({ ...inputs, cityB: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="share-ref"
          checked={inputs.shareAddressRef}
          onCheckedChange={(checked) => onInputsChange({ ...inputs, shareAddressRef: checked })}
        />
        <Label htmlFor="share-ref">b.address = a.address (share the same object)</Label>
      </div>
    </div>
  );
}
