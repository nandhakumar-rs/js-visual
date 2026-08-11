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
import type { NullUndefinedInputs, NullUndefinedStepState, ThirdValueOption } from "./types";

const OPTIONS: { value: ThirdValueOption; label: string }[] = [
  { value: "undefined", label: "undefined" },
  { value: "null", label: "null" },
  { value: "0", label: "0" },
  { value: "empty-string", label: '"" (empty string)' },
  { value: "false", label: "false" },
  { value: "nan", label: "NaN" },
  { value: "array", label: "[] (empty array)" },
  { value: "function", label: "() => {} (a function)" },
];

export function NullUndefinedControls({
  inputs,
  onInputsChange,
}: LabControlsProps<NullUndefinedInputs, NullUndefinedStepState>) {
  return (
    <div className="max-w-56 space-y-1">
      <Label htmlFor="third-value">Choose a value for c</Label>
      <Select
        value={inputs.thirdValue}
        onValueChange={(v) => onInputsChange({ thirdValue: v as ThirdValueOption })}
      >
        <SelectTrigger id="third-value">
          <SelectValue>
            {(value: ThirdValueOption) => OPTIONS.find((o) => o.value === value)?.label ?? value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
