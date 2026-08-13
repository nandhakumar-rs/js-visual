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
    question: "Does fetch()'s Promise reject on a 404 response?",
    options: [
      { id: "no", label: "No — it fulfils, and response.ok is false" },
      { id: "yes", label: "Yes, any status outside 200-299 rejects" },
      { id: "throws", label: "It throws synchronously before returning a Promise" },
    ],
    correctOptionId: "no",
    explanation:
      "fetch() only rejects when the request itself fails — no network, DNS failure, CORS. A 404 is a successful exchange with an error status, so the Promise fulfils and you have to check response.ok or response.status yourself.",
  },
  remember:
    "fetch() returns a Promise immediately; it resolves once the response headers arrive, moving from pending to fulfilled or rejected. It only rejects on a network-level failure — an HTTP error status like 404 still fulfils.",
};
