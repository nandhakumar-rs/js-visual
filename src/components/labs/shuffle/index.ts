import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ShuffleControls } from "./ShuffleControls";
import { ShuffleVisualization } from "./ShuffleVisualization";
import type { ShuffleInputs, ShuffleStepState } from "./types";

export const shuffleLab: LabDefinition<ShuffleInputs, ShuffleStepState> = {
  slug: "shuffle",
  mode: "scripted",
  defaultInputs: { items: ["A", "B", "C", "D", "E"], mode: "fisher-yates", shuffleTrigger: 0 },
  getCode,
  buildInitialSteps,
  Controls: ShuffleControls,
  Visualization: ShuffleVisualization,
  challenge: {
    question: "Does array.sort(() => Math.random() - 0.5) produce a fair, uniformly random shuffle?",
    options: [
      { id: "yes", label: "Yes, every ordering is equally likely" },
      { id: "no", label: "No, it's biased toward certain orderings" },
    ],
    correctOptionId: "no",
    explanation:
      "Sort algorithms don't compare every pair of elements the same number of times, so this trick produces a measurably biased distribution. Fisher–Yates is the correct, unbiased approach.",
  },
  remember:
    "Fisher–Yates shuffles an array fairly in O(n) by walking backward and swapping each position with a uniformly random earlier one. array.sort(() => Math.random() - 0.5) looks similar but is statistically biased.",
};
