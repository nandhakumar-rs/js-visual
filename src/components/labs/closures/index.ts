import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ClosuresControls } from "./ClosuresControls";
import { ClosuresVisualization } from "./ClosuresVisualization";
import type { ClosuresInputs, ClosuresStepState } from "./types";

export const closuresLab: LabDefinition<ClosuresInputs, ClosuresStepState> = {
  slug: "closures",
  mode: "interactive",
  defaultInputs: {},
  getCode,
  buildInitialSteps,
  Controls: ClosuresControls,
  Visualization: ClosuresVisualization,
  challenge: {
    question: "const counter = createCounter();\n\ncounter();\ncounter();\ncounter();\n\nWhat is count now?",
    code: ["const counter = createCounter();", "", "counter();", "counter();", "counter();"],
    options: [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
      { id: "undefined", label: "undefined" },
    ],
    correctOptionId: "3",
    explanation:
      "Each call uses the same closed-over count variable, incrementing it once per call: 1, then 2, then 3.",
  },
  remember: "Closures allow functions to keep access to variables from their lexical scope.",
};
