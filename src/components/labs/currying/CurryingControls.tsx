"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { CurryingInputs, CurryingStepState } from "./types";

export function CurryingControls({ inputs, onInputsChange }: LabControlsProps<CurryingInputs, CurryingStepState>) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4">
        <div className="w-24 space-y-1">
          <Label htmlFor="curry-a">a</Label>
          <Input
            id="curry-a"
            type="number"
            value={inputs.a}
            onChange={(e) => onInputsChange({ ...inputs, a: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="w-24 space-y-1">
          <Label htmlFor="curry-b">b</Label>
          <Input
            id="curry-b"
            type="number"
            value={inputs.b}
            onChange={(e) => onInputsChange({ ...inputs, b: Number(e.target.value) || 0 })}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Practical use: <code className="font-mono">const double = multiply(2); double(4); double(10);</code> —
        partially applying multiply creates a reusable, specialized function.
      </p>
    </div>
  );
}
