"use client";

import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import { THIRD_VALUE_META, type NullUndefinedInputs, type NullUndefinedStepState } from "./types";

export function NullUndefinedVisualization({
  step,
  inputs,
}: LabVisualizationProps<NullUndefinedInputs, NullUndefinedStepState>) {
  const revealed = step?.state?.revealedTypeofs ?? [];
  const c = THIRD_VALUE_META[inputs.thirdValue];

  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">a</p>
        <VariableBox status="undefined" value={undefined} highlighted={revealed.includes("a")} />
        {revealed.includes("a") && <p className="text-xs text-muted-foreground">typeof → &quot;undefined&quot;</p>}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">b</p>
        <VariableBox status="null" value={null} highlighted={revealed.includes("b")} />
        {revealed.includes("b") && <p className="text-xs text-muted-foreground">typeof → &quot;object&quot;</p>}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">c</p>
        <VariableBox status="set" displayValue={c.literal} highlighted={revealed.includes("c")} />
        {revealed.includes("c") && (
          <p className="text-xs text-muted-foreground">typeof → &quot;{c.typeofResult}&quot;</p>
        )}
      </div>
    </div>
  );
}
