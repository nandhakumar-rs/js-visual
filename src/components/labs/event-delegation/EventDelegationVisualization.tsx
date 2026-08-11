"use client";

import { EventBubble } from "@/components/visualizers/EventBubble";
import type { LabVisualizationProps } from "@/types/lab";
import type { EventDelegationInputs, EventDelegationStepState } from "./types";

export function EventDelegationVisualization({
  step,
  inputs,
}: LabVisualizationProps<EventDelegationInputs, EventDelegationStepState>) {
  const state = step?.state ?? { path: [], activeIndex: -1 };

  return (
    <div className="space-y-4">
      {state.path.length > 0 ? (
        <div className="space-y-2">
          {state.clickedLabel && (
            <p className="text-sm text-muted-foreground">
              Clicked: <span className="font-mono font-medium text-foreground">{state.clickedLabel}</span>
            </p>
          )}
          <EventBubble path={state.path} activeIndex={state.activeIndex} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No click yet — try an item in the list.</p>
      )}

      <div className="grid grid-cols-2 gap-2 text-center text-sm">
        <div className={`rounded-md border p-2 ${inputs.mode === "individual" ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}>
          <p className="text-lg font-semibold tabular-nums">{inputs.itemCount}</p>
          <p className="text-xs text-muted-foreground">Listeners (individual)</p>
        </div>
        <div className={`rounded-md border p-2 ${inputs.mode === "delegation" ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}>
          <p className="text-lg font-semibold tabular-nums">1</p>
          <p className="text-xs text-muted-foreground">Listeners (delegation)</p>
        </div>
      </div>
    </div>
  );
}
