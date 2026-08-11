"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { SearchMethod, UserExistenceInputs, UserExistenceStepState } from "./types";

const METHODS: SearchMethod[] = ["for", "some", "find", "findIndex"];

export function UserExistenceControls({
  inputs,
  onInputsChange,
}: LabControlsProps<UserExistenceInputs, UserExistenceStepState>) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-40 space-y-1">
        <Label htmlFor="search-name">Search for</Label>
        <Input
          id="search-name"
          value={inputs.searchName}
          onChange={(e) => onInputsChange({ ...inputs, searchName: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Method</p>
        <div role="radiogroup" aria-label="Method" className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={inputs.method === m}
              onClick={() => onInputsChange({ ...inputs, method: m })}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-sm transition-colors",
                inputs.method === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m}()
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
