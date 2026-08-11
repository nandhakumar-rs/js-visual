import type { ExecutionStep } from "@/lib/execution/types";
import type { EventDelegationStepState } from "./types";

export function buildInitialSteps(): ExecutionStep<EventDelegationStepState>[] {
  return [
    {
      id: "seed",
      title: "Waiting for a click",
      description: "Click any item in the list to see how the event travels.",
      activeCodeLines: [],
      state: { path: [], activeIndex: -1 },
    },
  ];
}
