import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { SortingControls } from "./SortingControls";
import { SortingVisualization } from "./SortingVisualization";
import type { SortingInputs, SortingStepState } from "./types";

export const sortingLab: LabDefinition<SortingInputs, SortingStepState> = {
  slug: "sorting",
  mode: "scripted",
  defaultInputs: { array: [10, 1, 2, 20], mode: "default" },
  getCode,
  buildInitialSteps,
  Controls: SortingControls,
  Visualization: SortingVisualization,
  prediction: {
    code: ["const numbers = [10, 1, 2, 20];", "numbers.sort();"],
    options: [
      { id: "asc", label: "[1, 2, 10, 20]" },
      { id: "weird", label: "[1, 10, 2, 20]" },
      { id: "unchanged", label: "[10, 1, 2, 20]" },
    ],
    correctOptionId: "weird",
    explanation:
      'Without a comparator, sort() compares elements as strings. "10" sorts before "2" because "1" < "2" as characters, giving the surprising [1, 10, 2, 20].',
  },
  challenge: {
    question: "const a = [3, 1, 2];\nconst b = a.toSorted((x, y) => x - y);\n\nIs a === b, and is a still [3, 1, 2]?",
    options: [
      { id: "same-mutated", label: "a === b, and a is now [1, 2, 3]" },
      { id: "diff-unmutated", label: "a !== b, and a is still [3, 1, 2]" },
    ],
    correctOptionId: "diff-unmutated",
    explanation:
      "toSorted() is the non-mutating counterpart to sort() — it returns a brand new sorted array and leaves the original completely untouched.",
  },
  remember:
    "sort() with no comparator sorts as strings, which is rarely what you want for numbers. sort((a,b) => a-b) sorts numerically but mutates the original array; toSorted() does the same without mutating.",
};
