"use client";

import { Shuffle as ShuffleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { ShuffleInputs, ShuffleMode, ShuffleStepState } from "./types";

const MODES: readonly ShuffleMode[] = ["fisher-yates", "flawed-sort"];

const MODE_LABEL: Record<ShuffleMode, string> = {
  "fisher-yates": "Fisher–Yates",
  "flawed-sort": "sort(Math.random) — flawed",
};

export function ShuffleControls({ inputs, onInputsChange }: LabControlsProps<ShuffleInputs, ShuffleStepState>) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label htmlFor="shuffle-items">Items</Label>
          <Input
            id="shuffle-items"
            defaultValue={inputs.items.join(", ")}
            onBlur={(e) =>
              onInputsChange({
                ...inputs,
                items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="gap-1.5"
          onClick={() => onInputsChange({ ...inputs, shuffleTrigger: inputs.shuffleTrigger + 1 })}
        >
          <ShuffleIcon className="size-4" />
          Shuffle
        </Button>
      </div>
      <SegmentedControl
        label="Shuffle method"
        labelAs="none"
        options={MODES}
        value={inputs.mode}
        onChange={(mode) => onInputsChange({ ...inputs, mode })}
        optionLabel={(mode) => MODE_LABEL[mode]}
        mono
      />
    </div>
  );
}
