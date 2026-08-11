"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { LabControlsProps } from "@/types/lab";
import type { ClassesInputs, ClassesStepState } from "./types";

export function ClassesControls({ inputs, onInputsChange }: LabControlsProps<ClassesInputs, ClassesStepState>) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-40 space-y-1">
        <Label htmlFor="employee-name">Name</Label>
        <Input
          id="employee-name"
          value={inputs.name}
          onChange={(e) => onInputsChange({ ...inputs, name: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="show-inheritance"
          checked={inputs.showInheritance}
          onCheckedChange={(checked) => onInputsChange({ ...inputs, showInheritance: checked })}
        />
        <Label htmlFor="show-inheritance">Show Manager (extends Employee)</Label>
      </div>
    </div>
  );
}
