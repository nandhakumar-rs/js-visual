"use client";

import { PromiseNode } from "@/components/visualizers/PromiseNode";
import { EventLoopVisualizer } from "@/components/visualizers/EventLoopVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { CallbackToPromiseInputs, CallbackToPromiseStepState } from "./types";

export function CallbackToPromiseVisualization({
  step,
}: LabVisualizationProps<CallbackToPromiseInputs, CallbackToPromiseStepState>) {
  const state = step?.state ?? { callStack: [], webApis: [] };

  return (
    <div className="space-y-3">
      {state.promiseState && <PromiseNode label="getUser(1)" state={state.promiseState} />}
      <EventLoopVisualizer
        callStack={state.callStack}
        webApis={state.webApis}
        showMicrotasks={false}
        showMacrotasks={false}
      />
    </div>
  );
}
