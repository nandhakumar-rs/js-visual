import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { XhrControls } from "./XhrControls";
import { XhrVisualization } from "./XhrVisualization";
import type { XhrInputs, XhrStepState } from "./types";

export const xhrLab: LabDefinition<XhrInputs, XhrStepState> = {
  slug: "xhr",
  mode: "scripted",
  defaultInputs: { willSucceed: true },
  getCode,
  buildInitialSteps,
  Controls: XhrControls,
  Visualization: XhrVisualization,
  challenge: {
    question: "What is the correct order of the XHR lifecycle?",
    options: [
      { id: "a", label: "create → open() → send() → onload/onerror" },
      { id: "b", label: "create → send() → open() → onload/onerror" },
      { id: "c", label: "open() → create → onload/onerror → send()" },
    ],
    correctOptionId: "a",
    explanation:
      "You create the XHR object, configure it with open(), THEN send it — the response handlers fire only after send() actually dispatches the request.",
  },
  remember:
    "XMLHttpRequest is the original browser API for network requests, with an event-driven lifecycle (open → send → onload/onerror). fetch() is preferred for new code because it's Promise-based.",
};
