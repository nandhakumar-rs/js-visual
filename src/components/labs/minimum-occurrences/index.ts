import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { MinOccurrencesControls } from "./MinOccurrencesControls";
import { MinOccurrencesVisualization } from "./MinOccurrencesVisualization";
import type { MinOccurrencesInputs, MinOccurrencesStepState } from "./types";

export const minimumOccurrencesLab: LabDefinition<MinOccurrencesInputs, MinOccurrencesStepState> = {
  slug: "minimum-occurrences",
  mode: "scripted",
  defaultInputs: { array: [3, 1, 4, 1, 5, 1] },
  getCode,
  buildInitialSteps,
  Controls: MinOccurrencesControls,
  Visualization: MinOccurrencesVisualization,
  challenge: {
    question: "For [3, 1, 4, 1, 5, 1], what are the minimum and its occurrence count?",
    options: [
      { id: "a", label: "Minimum: 1, Occurrences: 3" },
      { id: "b", label: "Minimum: 1, Occurrences: 1" },
      { id: "c", label: "Minimum: 3, Occurrences: 1" },
    ],
    correctOptionId: "a",
    explanation: "1 is the smallest value in the array, and it appears three times.",
  },
  remember:
    "Finding the minimum's occurrence count is a two-pass idea: first find the minimum (Math.min), then count how many elements equal it (filter + length).",
};
