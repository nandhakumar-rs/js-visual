import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ShallowComparisonControls } from "./ShallowComparisonControls";
import { ShallowComparisonVisualization } from "./ShallowComparisonVisualization";
import type { ShallowComparisonInputs, ShallowComparisonStepState } from "./types";

export const shallowComparisonLab: LabDefinition<ShallowComparisonInputs, ShallowComparisonStepState> = {
  slug: "shallow-comparison",
  mode: "scripted",
  defaultInputs: { nameA: "Maya", nameB: "Maya", cityA: "Chennai", cityB: "Chennai", shareAddressRef: false },
  getCode,
  buildInitialSteps,
  Controls: ShallowComparisonControls,
  Visualization: ShallowComparisonVisualization,
  prediction: {
    code: [
      'const a = { name: "Maya", address: { city: "Chennai" } };',
      'const b = { name: "Maya", address: { city: "Chennai" } };',
      "shallowEqual(a, b);",
    ],
    options: [
      { id: "true", label: "true — they look identical" },
      { id: "false", label: "false — address is compared by reference" },
    ],
    correctOptionId: "false",
    explanation:
      "Even though a and b have identical-looking data, a.address and b.address are two separate objects. A shallow comparison only checks reference equality for nested objects, so it returns false.",
  },
  challenge: {
    question: "A shallow comparison of two objects with identical nested content will report them as equal:",
    options: [
      { id: "true", label: "True — as long as the values look the same" },
      { id: "false", label: "False — nested objects are compared by reference, not contents" },
    ],
    correctOptionId: "false",
    explanation:
      "Shallow equality only goes one level deep. Nested objects are compared by reference identity, so two different (but identical-looking) nested objects make the whole comparison fail.",
  },
  remember:
    "Shallow comparison checks own properties one level deep: primitives by value, but nested objects by reference identity — two structurally identical nested objects are still considered different unless they're the exact same object.",
};
