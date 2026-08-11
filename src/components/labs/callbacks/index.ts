import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { CallbacksControls } from "./CallbacksControls";
import { CallbacksVisualization } from "./CallbacksVisualization";
import type { CallbacksInputs, CallbacksStepState } from "./types";

export const callbacksLab: LabDefinition<CallbacksInputs, CallbacksStepState> = {
  slug: "callbacks",
  mode: "scripted",
  defaultInputs: { delayMs: 1000 },
  getCode,
  buildInitialSteps,
  Controls: CallbacksControls,
  Visualization: CallbacksVisualization,
  challenge: {
    question: "getUser(1, callback) is called. Does getUser() wait for the timer before returning?",
    options: [
      { id: "yes", label: "Yes, it blocks until the callback fires" },
      { id: "no", label: "No, it returns immediately; the callback fires later" },
    ],
    correctOptionId: "no",
    explanation:
      "getUser() hands the timer off to the browser via setTimeout and returns right away. The callback only runs later, once the timer completes and the call stack is empty.",
  },
  remember:
    "A callback is a function handed to another function to be called later, once some work finishes — the calling function doesn't wait around for it.",
};
