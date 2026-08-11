import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { AsyncAwaitControls } from "./AsyncAwaitControls";
import { AsyncAwaitVisualization } from "./AsyncAwaitVisualization";
import type { AsyncAwaitInputs, AsyncAwaitStepState } from "./types";

export const asyncAwaitLab: LabDefinition<AsyncAwaitInputs, AsyncAwaitStepState> = {
  slug: "async-await",
  mode: "scripted",
  defaultInputs: { statusesFail: false, style: "async-await" },
  getCode,
  buildInitialSteps,
  Controls: AsyncAwaitControls,
  Visualization: AsyncAwaitVisualization,
  challenge: {
    question: "While a function is paused at an await, does the JavaScript thread sit idle waiting?",
    options: [
      { id: "yes", label: "Yes, nothing else can run until it resumes" },
      { id: "no", label: "No, the thread is free to run other code in the meantime" },
    ],
    correctOptionId: "no",
    explanation:
      "await only pauses the async function itself. The JavaScript thread is freed up to do other work — handle other events, run other code — and resumes this function once the awaited promise settles.",
  },
  remember:
    "async/await changes how asynchronous code is WRITTEN — letting it read top-to-bottom like synchronous code — but not the underlying asynchronous nature. It's syntactic sugar over Promises, and await never blocks the JS thread.",
};
