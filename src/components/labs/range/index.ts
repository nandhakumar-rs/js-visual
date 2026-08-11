import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { RangeControls } from "./RangeControls";
import { RangeVisualization } from "./RangeVisualization";
import type { RangeInputs, RangeStepState } from "./types";

export const rangeLab: LabDefinition<RangeInputs, RangeStepState> = {
  slug: "range",
  mode: "scripted",
  defaultInputs: { start: 2, end: 8, step: 1 },
  getCode,
  buildInitialSteps,
  Controls: RangeControls,
  Visualization: RangeVisualization,
  challenge: {
    question: "range(2, 8, 2) returns:",
    options: [
      { id: "a", label: "[2, 4, 6]" },
      { id: "b", label: "[2, 4, 6, 8]" },
      { id: "c", label: "[2, 3, 4, 5, 6, 7]" },
    ],
    correctOptionId: "a",
    explanation:
      "The loop starts at 2 and keeps going while i < 8, adding 2 each time: 2, 4, 6 — then 8 fails the i < 8 check, so it's excluded.",
  },
  remember: "range(start, end, step) loops while i < end, pushing each value — end itself is never included.",
};
