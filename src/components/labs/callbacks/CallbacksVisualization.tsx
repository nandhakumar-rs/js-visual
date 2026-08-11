"use client";

import { EventLoopVisualizer } from "@/components/visualizers/EventLoopVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { CallbacksInputs, CallbacksStepState } from "./types";

export function CallbacksVisualization({
  step,
}: LabVisualizationProps<CallbacksInputs, CallbacksStepState>) {
  const state = step?.state ?? { callStack: [], webApis: [], macrotasks: [], loopActive: false };

  return (
    <EventLoopVisualizer
      callStack={state.callStack}
      webApis={state.webApis}
      macrotasks={state.macrotasks}
      loopActive={state.loopActive}
      showMicrotasks={false}
    />
  );
}
