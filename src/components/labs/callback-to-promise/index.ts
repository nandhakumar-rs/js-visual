import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { CallbackToPromiseControls } from "./CallbackToPromiseControls";
import { CallbackToPromiseVisualization } from "./CallbackToPromiseVisualization";
import type { CallbackToPromiseInputs, CallbackToPromiseStepState } from "./types";

export const callbackToPromiseLab: LabDefinition<CallbackToPromiseInputs, CallbackToPromiseStepState> = {
  slug: "callback-to-promise",
  mode: "scripted",
  defaultInputs: { style: "promise" },
  getCode,
  buildInitialSteps,
  Controls: CallbackToPromiseControls,
  Visualization: CallbackToPromiseVisualization,
  challenge: {
    question: "function getUser(id) { return new Promise((resolve, reject) => { ... }); }\n\nWhat do resolve and reject do?",
    options: [
      { id: "a", label: "They settle the Promise as fulfilled or rejected" },
      { id: "b", label: "They cancel the Promise" },
      { id: "c", label: "They're just regular parameter names with no special meaning" },
    ],
    correctOptionId: "a",
    explanation:
      "resolve(value) and reject(reason) are functions the Promise executor receives specifically to settle the Promise — calling one moves it out of the pending state permanently.",
  },
  remember:
    'Any callback-based function can be "promisified" by wrapping it in new Promise((resolve, reject) => {...}), calling resolve on success and reject on error — giving asynchronous work an object representing its future result.',
};
