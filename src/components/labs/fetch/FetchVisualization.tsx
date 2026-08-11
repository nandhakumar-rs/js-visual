"use client";

import { PromiseNode } from "@/components/visualizers/PromiseNode";
import { EventLoopVisualizer } from "@/components/visualizers/EventLoopVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { FetchInputs, FetchStepState } from "./types";

export function FetchVisualization({ step }: LabVisualizationProps<FetchInputs, FetchStepState>) {
  const state = step?.state ?? {
    promiseState: "pending" as const,
    callStack: [],
    microtasks: [],
    loopActive: false,
  };

  return (
    <div className="space-y-3">
      <PromiseNode label={'fetch("/users")'} state={state.promiseState} />
      <EventLoopVisualizer
        callStack={state.callStack}
        microtasks={state.microtasks}
        loopActive={state.loopActive}
        showWebApis={false}
        showMacrotasks={false}
      />
    </div>
  );
}
