import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { DedupControls } from "./DedupControls";
import { DedupVisualization } from "./DedupVisualization";
import type { DedupInputs, DedupStepState } from "./types";

export const removingDuplicatesLab: LabDefinition<DedupInputs, DedupStepState> = {
  slug: "removing-duplicates",
  mode: "scripted",
  defaultInputs: { array: [1, 2, 2, 3, 1], method: "set" },
  getCode,
  buildInitialSteps,
  Controls: DedupControls,
  Visualization: DedupVisualization,
  challenge: {
    question: "[...new Set([1, 2, 2, 3, 1])] evaluates to:",
    options: [
      { id: "a", label: "[1, 2, 2, 3, 1]" },
      { id: "b", label: "[1, 2, 3]" },
      { id: "c", label: "[1, 1, 2, 2, 3]" },
    ],
    correctOptionId: "b",
    explanation:
      "A Set can only hold unique values, so dropping the array into one and spreading it back out removes every duplicate, preserving first-seen order.",
  },
  remember:
    "A Set only stores unique values, so [...new Set(array)] is the simplest way to remove duplicates. filter() and reduce() can achieve the same result manually.",
};
