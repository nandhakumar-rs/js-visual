import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { FetchControls } from "./FetchControls";
import { FetchVisualization } from "./FetchVisualization";
import type { FetchInputs, FetchStepState } from "./types";

export const fetchLab: LabDefinition<FetchInputs, FetchStepState> = {
  slug: "fetch",
  mode: "scripted",
  defaultInputs: { willSucceed: true },
  getCode,
  buildInitialSteps,
  Controls: FetchControls,
  Visualization: FetchVisualization,
  prediction: {
    code: ['fetch("/users")', "  .then(response => response.json())"],
    options: [
      { id: "sync", label: "fetch() waits and returns the data directly" },
      { id: "promise", label: "fetch() immediately returns a pending Promise" },
      { id: "error", label: "fetch() throws unless awaited" },
    ],
    correctOptionId: "promise",
    explanation:
      "fetch() never blocks — it returns a Promise instantly, which later settles to fulfilled or rejected once the network request completes.",
  },
  challenge: {
    question: "Where do .then() and .catch() callbacks get scheduled once their Promise settles?",
    options: [
      { id: "a", label: "The microtask queue" },
      { id: "b", label: "The task (macrotask) queue" },
      { id: "c", label: "They run synchronously, immediately" },
    ],
    correctOptionId: "a",
    explanation:
      "Promise callbacks (.then/.catch/.finally) are microtasks — they run after the current synchronous code finishes, but before the event loop picks up any macrotask like a setTimeout callback.",
  },
  remember:
    "fetch() returns a Promise immediately; it resolves once the response headers arrive, moving from pending to fulfilled or rejected. .then()/.catch() callbacks run as microtasks.",
};
