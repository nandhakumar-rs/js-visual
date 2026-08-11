"use client";

import { VariableBox } from "@/components/visualizers/VariableBox";
import { OperationFlow } from "@/components/visualizers/OperationFlow";
import type { LabVisualizationProps } from "@/types/lab";
import { THIRD_VALUE_META, type NullUndefinedInputs, type NullUndefinedStepState } from "./types";

export function NullUndefinedVisualization({
  step,
  inputs,
}: LabVisualizationProps<NullUndefinedInputs, NullUndefinedStepState>) {
  const revealed = step?.state?.revealedTypeofs ?? [];
  const c = THIRD_VALUE_META[inputs.thirdValue];

  let flow: { label: string; input: string; output: string; note?: { term: string; tooltip: string } } | undefined;
  if (step?.id === "typeof-a") {
    flow = { label: "a", input: "undefined", output: '"undefined"' };
  } else if (step?.id === "typeof-b") {
    flow = {
      label: "b",
      input: "null",
      output: '"object"',
      note: {
        term: "historical quirk",
        tooltip: "Old behavior kept for compatibility, even though it looks strange today.",
      },
    };
  } else if (step?.id === "typeof-c") {
    flow = { label: "c", input: c.literal, output: `"${c.typeofResult}"` };
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">a</p>
          <VariableBox status="undefined" value={undefined} highlighted={revealed.includes("a")} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">b</p>
          <VariableBox status="null" value={null} highlighted={revealed.includes("b")} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">c</p>
          <VariableBox status="set" displayValue={c.literal} highlighted={revealed.includes("c")} />
        </div>
      </div>
      {flow && <OperationFlow label={flow.label} input={flow.input} operator="typeof" output={flow.output} note={flow.note} />}
    </div>
  );
}
