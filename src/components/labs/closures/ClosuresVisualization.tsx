"use client";

import { ScopeBox } from "@/components/visualizers/ScopeBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { ClosuresInputs, ClosuresStepState } from "./types";

export function ClosuresVisualization({
  step,
}: LabVisualizationProps<ClosuresInputs, ClosuresStepState>) {
  const counters = step?.state?.counters ?? [];
  const activeCounterId = step?.state?.activeCounterId;

  return (
    <ScopeBox
      label="Global Scope"
      kind="global"
      isActive={!activeCounterId}
      variables={[]}
      emptyHint={counters.length === 0 ? "No counters created yet." : undefined}
    >
      {counters.map((counter) => (
        <ScopeBox
          key={counter.id}
          label={`${counter.label} → Closure`}
          kind="closure"
          isActive={counter.id === activeCounterId}
          variables={[
            {
              name: "count",
              value: counter.count,
              previousValue: counter.previousCount,
              status: counter.previousCount !== undefined ? "updated" : "set",
            },
          ]}
        />
      ))}
    </ScopeBox>
  );
}
