"use client";

import { PromiseNode } from "@/components/visualizers/PromiseNode";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { PromiseAllInputs, PromiseAllStepState } from "./types";

export function PromiseAllVisualization({
  step,
}: LabVisualizationProps<PromiseAllInputs, PromiseAllStepState>) {
  const state = step?.state ?? { requests: [], allState: "pending" as const };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {state.requests.map((r) => (
          <PromiseNode key={r.id} label={r.label} state={r.status} />
        ))}
      </div>
      <PromiseNode label="Promise.all([...])" state={state.allState} />
      {state.errorMessage && <p className="text-sm text-destructive">{state.errorMessage}</p>}
      {state.combined && (
        <div className="space-y-2">
          {state.combined.map((c, i) => (
            <ObjectVisualizer
              key={i}
              entries={[
                { key: "name", displayValue: `"${c.name}"` },
                { key: "active", displayValue: String(c.active) },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
