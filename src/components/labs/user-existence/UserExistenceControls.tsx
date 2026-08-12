"use client";

import { useState } from "react";
import { Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { SearchOutcome, UserExistenceInputs, UserExistenceStepState } from "./types";

const OUTCOMES: readonly SearchOutcome[] = ["some", "find", "findIndex", "forOf"];

const OUTCOME_LABEL: Record<SearchOutcome, string> = {
  some: "Yes or no — some()",
  find: "Matching user — find()",
  findIndex: "Position — findIndex()",
  forOf: "Manual search — for...of",
};

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

      <SegmentedControl
        label="What do you need back?"
        size="md"
        labelAs="label"
        options={OUTCOMES}
        value={inputs.outcome}
        onChange={(outcome) => onInputsChange({ ...inputs, outcome })}
        optionLabel={(outcome) => OUTCOME_LABEL[outcome]}
      />

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
