import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ThisControls } from "./ThisControls";
import { ThisVisualization } from "./ThisVisualization";
import type { ThisInputs, ThisStepState } from "./types";

export const thisLab: LabDefinition<ThisInputs, ThisStepState> = {
  slug: "this",
  mode: "scripted",
  defaultInputs: { scenario: "object-method", useBind: true },
  getCode,
  buildInitialSteps,
  Controls: ThisControls,
  Visualization: ThisVisualization,
  challenge: {
    question: "const obj = { name: \"X\", greet() { return this.name; } };\nconst fn = obj.greet;\nfn();\n\nWhat happens?",
    options: [
      { id: "x", label: 'Returns "X"' },
      { id: "error", label: "Throws — this is undefined" },
      { id: "undefined", label: "Returns undefined without an error" },
    ],
    correctOptionId: "error",
    explanation:
      "Detaching greet from obj into a plain variable loses the implicit binding. Calling fn() with no receiving object leaves this as undefined, so this.name throws.",
  },
  remember:
    "this is not fixed — it depends on HOW a function is called: implicit binding for obj.method(), undefined for a plain call, explicit binding via bind()/call()/apply(), new-binding for constructors, and lexical (inherited) binding for arrow functions.",
};
