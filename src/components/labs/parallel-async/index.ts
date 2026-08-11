import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ParallelAsyncControls } from "./ParallelAsyncControls";
import { ParallelAsyncVisualization } from "./ParallelAsyncVisualization";
import type { ParallelAsyncInputs, ParallelAsyncStepState } from "./types";

export const parallelAsyncLab: LabDefinition<ParallelAsyncInputs, ParallelAsyncStepState> = {
  slug: "parallel-async",
  mode: "scripted",
  defaultInputs: { mode: "parallel" },
  getCode,
  buildInitialSteps,
  Controls: ParallelAsyncControls,
  Visualization: ParallelAsyncVisualization,
  challenge: {
    question: "Three requests take 800ms, 1200ms, and 500ms. Run in parallel via Promise.all, how long until all three are done?",
    options: [
      { id: "2500", label: "2500ms (the sum)" },
      { id: "1200", label: "1200ms (the longest one)" },
      { id: "500", label: "500ms (the shortest one)" },
    ],
    correctOptionId: "1200",
    explanation:
      "Since all three start at the same time, the total wait is bounded by whichever one takes the longest — 1200ms — not the sum of all three.",
  },
  remember:
    "Awaiting requests one at a time adds up their durations. Starting them together (e.g. via Promise.all) bounds the total time by the slowest single request.",
};
