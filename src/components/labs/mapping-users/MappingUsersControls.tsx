"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LabControlsProps } from "@/types/lab";
import type { MappedProperty, MappingInputs, MappingStepState } from "./types";

export function MappingUsersControls({
  inputs,
  onInputsChange,
}: LabControlsProps<MappingInputs, MappingStepState>) {
  return (
    <div className="max-w-56 space-y-1">
      <Label htmlFor="mapped-property">What should each user become?</Label>
      <Select
        value={inputs.property}
        onValueChange={(v) => onInputsChange({ ...inputs, property: v as MappedProperty })}
      >
        <SelectTrigger id="mapped-property">
          <SelectValue>{(value: MappedProperty) => (value === "name" ? "Name" : "Age")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="age">Age</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
