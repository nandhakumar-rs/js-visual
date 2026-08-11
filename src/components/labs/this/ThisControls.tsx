"use client";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { ThisInputs, ThisScenario, ThisStepState } from "./types";

const SCENARIOS: { value: ThisScenario; label: string }[] = [
  { value: "object-method", label: "Object Method" },
  { value: "regular-function", label: "Regular Function" },
  { value: "arrow-function", label: "Arrow Function" },
  { value: "class-method", label: "Class Method" },
  { value: "detached-method", label: "Detached Method" },
];

export function ThisControls({ inputs, onInputsChange }: LabControlsProps<ThisInputs, ThisStepState>) {
  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Scenario" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {SCENARIOS.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={inputs.scenario === s.value}
            onClick={() => onInputsChange({ ...inputs, scenario: s.value })}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs transition-colors sm:text-sm",
              inputs.scenario === s.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {inputs.scenario === "detached-method" && (
        <div className="flex items-center gap-2">
          <Switch
            id="use-bind"
            checked={inputs.useBind}
            onCheckedChange={(checked) => onInputsChange({ ...inputs, useBind: checked })}
          />
          <Label htmlFor="use-bind">Fix it with .bind(person)</Label>
        </div>
      )}
    </div>
  );
}
