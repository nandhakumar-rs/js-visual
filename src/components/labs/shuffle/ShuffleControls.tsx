"use client";

import { Shuffle as ShuffleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { ShuffleInputs, ShuffleMode, ShuffleStepState } from "./types";

const MODES: { value: ShuffleMode; label: string }[] = [
  { value: "fisher-yates", label: "Fisher–Yates" },
  { value: "flawed-sort", label: "sort(Math.random) — flawed" },
];

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
      <div role="radiogroup" aria-label="Shuffle method" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={inputs.mode === m.value}
            onClick={() => onInputsChange({ ...inputs, mode: m.value })}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
              inputs.mode === m.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
