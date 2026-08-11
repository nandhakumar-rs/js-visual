import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ConcatArraysControls } from "./ConcatArraysControls";
import { ConcatArraysVisualization } from "./ConcatArraysVisualization";
import type { ConcatArraysInputs, ConcatArraysStepState } from "./types";

export const concatenatingArraysLab: LabDefinition<ConcatArraysInputs, ConcatArraysStepState> = {
  slug: "concatenating-arrays",
  mode: "scripted",
  defaultInputs: { a: [1, 2], b: [3, 4], mode: "concat" },
  getCode,
  buildInitialSteps,
  Controls: ConcatArraysControls,
  Visualization: ConcatArraysVisualization,
  challenge: {
    question: "const a = [1, 2];\nconst b = [3, 4];\nconst result = a.concat(b);\n\nDoes this change a or b?",
    options: [
      { id: "yes", label: "Yes, both are mutated" },
      { id: "a-only", label: "Only a is mutated" },
      { id: "no", label: "No, neither is mutated" },
    ],
    correctOptionId: "no",
    explanation:
      "a.concat(b) (and [...a, ...b]) both build a brand new array. a and b are left completely unchanged in every case.",
  },
  remember:
    "Both array.concat() and [...a, ...b] build a new array without mutating either source array — they're equivalent, non-mutating ways to combine arrays.",
};
