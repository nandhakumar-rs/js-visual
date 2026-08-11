import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { CurryingControls } from "./CurryingControls";
import { CurryingVisualization } from "./CurryingVisualization";
import type { CurryingInputs, CurryingStepState } from "./types";

export const curryingLab: LabDefinition<CurryingInputs, CurryingStepState> = {
  slug: "currying",
  mode: "scripted",
  defaultInputs: { a: 2, b: 3 },
  getCode,
  buildInitialSteps,
  Controls: CurryingControls,
  Visualization: CurryingVisualization,
  challenge: {
    question: "const add10 = multiply(10);\n\nWhat does add10(5) return? (multiply is the curried version above)",
    options: [
      { id: "15", label: "15" },
      { id: "50", label: "50" },
      { id: "undefined", label: "undefined" },
    ],
    correctOptionId: "50",
    explanation:
      "multiply(10) returns a function that closes over a = 10. Calling that function with 5 computes 10 * 5 = 50.",
  },
  remember:
    "Currying transforms a multi-argument function into a chain of single-argument functions, each remembering earlier arguments via closures.",
};
