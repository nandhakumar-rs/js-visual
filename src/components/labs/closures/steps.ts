import type { ExecutionStep } from "@/lib/execution/types";
import type { ClosuresStepState } from "./types";

export function buildInitialSteps(): ExecutionStep<ClosuresStepState>[] {
  return [
    {
      id: "seed",
      title: "No counters yet",
      description: 'Click "Create Counter" to call createCounter() and watch a closure form.',
      whyExplanation:
        "createCounter() hasn't run yet, so there's no scope holding a count variable and nothing to close over.",
      activeCodeLines: [],
      state: { counters: [] },
    },
  ];
}
