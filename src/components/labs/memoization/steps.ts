import type { ExecutionStep } from "@/lib/execution/types";
import type { MemoizationStepState } from "./types";

export function buildInitialSteps(): ExecutionStep<MemoizationStepState>[] {
  return [
    {
      id: "seed",
      title: "Cache is empty",
      description: "Call slowCalculation(n) with a few different numbers — and try repeating one.",
      activeCodeLines: [0],
      state: { cache: [], calls: 0, calculations: 0, cacheHits: 0 },
    },
  ];
}
