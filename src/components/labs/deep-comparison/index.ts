import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { DeepComparisonControls } from "./DeepComparisonControls";
import { DeepComparisonVisualization } from "./DeepComparisonVisualization";
import type { DeepComparisonInputs, DeepComparisonStepState } from "./types";

export const deepComparisonLab: LabDefinition<DeepComparisonInputs, DeepComparisonStepState> = {
  slug: "deep-comparison",
  mode: "scripted",
  defaultInputs: { nameA: "Maya", nameB: "Maya", cityA: "Chennai", cityB: "Chennai" },
  getCode,
  buildInitialSteps,
  Controls: DeepComparisonControls,
  Visualization: DeepComparisonVisualization,
  challenge: {
    question: "Change b.address.city to \"Bangalore\" while a.address.city stays \"Chennai\". What happens to deepEqual(a, b)?",
    options: [
      { id: "true", label: "Still true — only the top level matters" },
      { id: "false", label: "Becomes false — the mismatch is caught at that nested node" },
    ],
    correctOptionId: "false",
    explanation:
      "deepEqual recurses all the way down. A mismatch at address.city — no matter how deeply nested — makes the whole comparison fail.",
  },
  remember:
    "Deep comparison recursively checks every nested value, not just the top level — it only reports equal once every leaf value matches, all the way down.",
};
