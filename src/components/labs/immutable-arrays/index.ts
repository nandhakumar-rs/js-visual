import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ImmutableArraysControls } from "./ImmutableArraysControls";
import { ImmutableArraysVisualization } from "./ImmutableArraysVisualization";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export const immutableArraysLab: LabDefinition<ImmutableArrayInputs, ImmutableArrayStepState> = {
  slug: "immutable-arrays",
  mode: "scripted",
  defaultInputs: { mode: "push", newValue: 4 },
  getCode,
  buildInitialSteps,
  Controls: ImmutableArraysControls,
  Visualization: ImmutableArraysVisualization,
  challenge: {
    question: "const a = [1, 2, 3];\nconst b = [...a, 4];\n\nIs a === b?",
    options: [
      { id: "true", label: "true" },
      { id: "false", label: "false" },
    ],
    correctOptionId: "false",
    explanation:
      "The spread operator builds a brand new array object. a and b happen to share some values, but they are two different objects — a === b is false.",
  },
  remember:
    "array.push() mutates the original array and keeps the same reference. [...array, item] creates a new array, leaving the original untouched.",
};
