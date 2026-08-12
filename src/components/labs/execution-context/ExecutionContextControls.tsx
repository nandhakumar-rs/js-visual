"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { ExecutionContextInputs, ExecutionContextStepState } from "./types";

const DEFAULT_INPUTS: ExecutionContextInputs = { a: 4, b: 5, bonus: 2 };

export function ExecutionContextControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ExecutionContextInputs, ExecutionContextStepState>) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Change the inputs to see the same call sequence run with different values.
      </p>
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-28 space-y-1">
          <Label htmlFor="ec-a" className="whitespace-nowrap">First number</Label>
          <Input
            id="ec-a"
            type="number"
            value={inputs.a}
            onChange={(e) => onInputsChange({ ...inputs, a: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="w-32 space-y-1">
          <Label htmlFor="ec-b" className="whitespace-nowrap">Second number</Label>
          <Input
            id="ec-b"
            type="number"
            value={inputs.b}
            onChange={(e) => onInputsChange({ ...inputs, b: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="w-20 space-y-1">
          <Label htmlFor="ec-bonus" className="whitespace-nowrap">Bonus</Label>
          <Input
            id="ec-bonus"
            type="number"
            value={inputs.bonus}
            onChange={(e) => onInputsChange({ ...inputs, bonus: Number(e.target.value) || 0 })}
          />
        </div>

        <Button variant="outline" size="default" onClick={() => onInputsChange(DEFAULT_INPUTS)} className="gap-1.5">
          <RotateCcw className="size-4" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
