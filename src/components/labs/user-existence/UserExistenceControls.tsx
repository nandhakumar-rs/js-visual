"use client";

import { useState } from "react";
import { Info, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabControlsProps } from "@/types/lab";
import type { SearchOutcome, UserExistenceInputs, UserExistenceStepState } from "./types";

const OUTCOMES: { value: SearchOutcome; label: string }[] = [
  { value: "some", label: "Yes or no — some()" },
  { value: "find", label: "Matching user — find()" },
  { value: "findIndex", label: "Position — findIndex()" },
  { value: "forOf", label: "Manual search — for...of" },
];

const DEFAULT_INPUTS: UserExistenceInputs = {
  users: [{ name: "Alex" }, { name: "Maya" }, { name: "John" }, { name: "Priya" }],
  searchName: "Maya",
  outcome: "some",
};

export function UserExistenceControls({
  inputs,
  onInputsChange,
}: LabControlsProps<UserExistenceInputs, UserExistenceStepState>) {
  const [text, setText] = useState(inputs.searchName);
  const [error, setError] = useState<string | null>(null);

  function commit(value: string) {
    const trimmed = value.trim();
    if (trimmed === "") {
      setError("Enter a name to search for");
      return;
    }
    setError(null);
    onInputsChange({ ...inputs, searchName: trimmed });
  }

  function handleResetDefaults() {
    setText(DEFAULT_INPUTS.searchName);
    setError(null);
    onInputsChange(DEFAULT_INPUTS);
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="w-48 space-y-1">
        <Label htmlFor="search-name" className="flex items-center gap-1">
          Who should we look for?
          <Tooltip>
            <TooltipTrigger
              aria-label="Matching is case-sensitive"
              className="inline-flex cursor-help items-center text-muted-foreground hover:text-foreground"
            >
              <Info className="size-3" aria-hidden />
            </TooltipTrigger>
            <TooltipContent className="w-64 max-w-64 flex-col items-start whitespace-normal text-left text-[0.8rem] leading-relaxed">
              Names must use the same uppercase and lowercase letters. For example, <InlineCode>Maya</InlineCode> and{" "}
              <InlineCode>maya</InlineCode> are treated as different names.
            </TooltipContent>
          </Tooltip>
        </Label>
        <Input
          id="search-name"
          value={text}
          aria-invalid={error ? true : undefined}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="space-y-1">
        <Label>What do you need back?</Label>
        <div
          role="radiogroup"
          aria-label="What do you need back?"
          className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5"
        >
          {OUTCOMES.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={inputs.outcome === o.value}
              onClick={() => onInputsChange({ ...inputs, outcome: o.value })}
              className={cn(
                "rounded-md px-3 py-1 text-sm transition-colors",
                inputs.outcome === o.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-3.5" aria-hidden />
        <Button variant="outline" size="default" onClick={handleResetDefaults} className="gap-1.5">
          <RotateCcw className="size-4" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
