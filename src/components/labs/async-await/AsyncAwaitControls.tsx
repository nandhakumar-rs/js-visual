"use client";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { AsyncAwaitInputs, AsyncAwaitStepState, AsyncStyle } from "./types";

const STYLES: { value: AsyncStyle; label: string }[] = [
  { value: "promises", label: "Promises" },
  { value: "async-await", label: "Async / Await" },
];

export function AsyncAwaitControls({
  inputs,
  onInputsChange,
}: LabControlsProps<AsyncAwaitInputs, AsyncAwaitStepState>) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div role="radiogroup" aria-label="Code style" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {STYLES.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={inputs.style === s.value}
            onClick={() => onInputsChange({ ...inputs, style: s.value })}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              inputs.style === s.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="async-statuses-fail"
          checked={inputs.statusesFail}
          onCheckedChange={(checked) => onInputsChange({ ...inputs, statusesFail: checked })}
        />
        <Label htmlFor="async-statuses-fail">Make getStatuses() fail</Label>
      </div>
    </div>
  );
}
