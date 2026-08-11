import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { MemoizationControls } from "./MemoizationControls";
import { MemoizationVisualization } from "./MemoizationVisualization";
import type { MemoizationInputs, MemoizationStepState } from "./types";

export const memoizationLab: LabDefinition<MemoizationInputs, MemoizationStepState> = {
  slug: "memoization",
  mode: "interactive",
  defaultInputs: {},
  getCode,
  buildInitialSteps,
  Controls: MemoizationControls,
  Visualization: MemoizationVisualization,
  challenge: {
    question: "You call slowCalculation(5), then slowCalculation(8), then slowCalculation(5) again. How many actual calculations happen?",
    options: [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
    ],
    correctOptionId: "2",
    explanation:
      "The first slowCalculation(5) and slowCalculation(8) both miss the cache and calculate. The second slowCalculation(5) hits the cache from the first call, so no calculation happens — just 2 total.",
  },
  remember:
    "Memoization caches a function's results by input: a cache hit returns the stored value instantly, a cache miss calculates, stores, and then returns — trading memory for speed on repeated calls.",
};
