import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { HoistingControls } from "./HoistingControls";
import { HoistingVisualization } from "./HoistingVisualization";
import type { HoistingInputs, HoistingStepState } from "./types";

export const hoistingLab: LabDefinition<HoistingInputs, HoistingStepState> = {
  slug: "hoisting",
  mode: "scripted",
  defaultInputs: { declarationType: "var" },
  getCode,
  buildInitialSteps,
  Controls: HoistingControls,
  Visualization: HoistingVisualization,
  prediction: {
    code: ['console.log(name);', 'var name = "Sam";'],
    options: [
      { id: "sam", label: "Sam" },
      { id: "undefined", label: "undefined" },
      { id: "referenceerror", label: "ReferenceError" },
      { id: "null", label: "null" },
    ],
    correctOptionId: "undefined",
    explanation:
      "var declarations are hoisted and initialized to undefined during the creation phase, so name already exists (as undefined) by the time console.log runs.",
  },
  challenge: {
    question: 'What does this log?\n\nconsole.log(age);\nlet age = 25;',
    code: ["console.log(age);", "let age = 25;"],
    options: [
      { id: "25", label: "25" },
      { id: "undefined", label: "undefined" },
      { id: "referenceerror", label: "ReferenceError" },
      { id: "null", label: "null" },
    ],
    correctOptionId: "referenceerror",
    explanation:
      "age is a let binding, so it's hoisted into the Temporal Dead Zone. Accessing it before its declaration line runs throws a ReferenceError — it's hoisted, just not initialized yet.",
  },
  remember:
    "var declarations are hoisted and initialized to undefined. let and const are hoisted too, but stay uninitialized in the Temporal Dead Zone until their declaration line runs — accessing them early throws a ReferenceError.",
};
