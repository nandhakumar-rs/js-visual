"use client";

import { ArrowDown } from "lucide-react";
import { ScopeBox } from "@/components/visualizers/ScopeBox";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { CurryingInputs, CurryingStepState } from "./types";

export function CurryingVisualization({ step }: LabVisualizationProps<CurryingInputs, CurryingStepState>) {
  const state = step?.state ?? { stage: "idle" };

  if (state.stage === "idle") {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  return (
    <div className="space-y-3">
      <ScopeBox
        label="multiply(a) closure"
        kind="closure"
        isActive={state.stage === "outer"}
        variables={state.a !== undefined ? [{ name: "a", value: state.a, status: "set" }] : []}
      >
        {state.stage !== "outer" && state.b !== undefined && (
          <div className="flex items-center gap-2">
            <ArrowDown className="size-3.5 text-muted-foreground" />
            <VariableBox name="b" value={state.b} status="set" size="sm" />
          </div>
        )}
      </ScopeBox>

      {state.result !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Result</span>
          <VariableBox value={state.result} status="updated" />
        </div>
      )}
    </div>
  );
}
