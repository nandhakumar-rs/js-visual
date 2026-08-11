import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { NullUndefinedControls } from "./NullUndefinedControls";
import { NullUndefinedVisualization } from "./NullUndefinedVisualization";
import type { NullUndefinedInputs, NullUndefinedStepState } from "./types";

export const nullVsUndefinedLab: LabDefinition<NullUndefinedInputs, NullUndefinedStepState> = {
  slug: "null-vs-undefined",
  mode: "scripted",
  defaultInputs: { thirdValue: "0" },
  getCode,
  buildInitialSteps,
  Controls: NullUndefinedControls,
  Visualization: NullUndefinedVisualization,
  prediction: {
    code: ["let b = null;", "console.log(typeof b);"],
    options: [
      { id: "null", label: '"null"' },
      { id: "object", label: '"object"' },
      { id: "undefined", label: '"undefined"' },
    ],
    correctOptionId: "object",
    explanation:
      'typeof null returns "object" — a famous historical bug in JavaScript kept for backwards compatibility. null is not actually an object.',
  },
  challenge: {
    question: "Which value means \"JavaScript doesn't currently have a value here\" (as opposed to a value the programmer intentionally left empty)?",
    options: [
      { id: "undefined", label: "undefined" },
      { id: "null", label: "null" },
    ],
    correctOptionId: "undefined",
    explanation:
      "undefined is JavaScript's own \"nothing here yet\" — it shows up for unassigned variables, missing properties, and functions with no return. null is something a programmer sets deliberately.",
  },
  remember:
    "undefined means a value hasn't been set yet; null means a value was intentionally set to empty. typeof null === \"object\" is a historical quirk, not a sign that null is an object.",
};
