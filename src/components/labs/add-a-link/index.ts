import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { AddLinkControls } from "./AddLinkControls";
import { AddLinkVisualization } from "./AddLinkVisualization";
import type { AddLinkInputs, AddLinkStepState } from "./types";

export const addLinkLab: LabDefinition<AddLinkInputs, AddLinkStepState> = {
  slug: "add-a-link",
  mode: "scripted",
  defaultInputs: { href: "https://example.com", text: "Visit Example" },
  getCode,
  buildInitialSteps,
  Controls: AddLinkControls,
  Visualization: AddLinkVisualization,
  challenge: {
    question: "const el = document.createElement(\"a\");\nel.href = \"...\";\n\nAt this point, is el visible on the page?",
    options: [
      { id: "yes", label: "Yes, it appears immediately" },
      { id: "no", label: "No, it's still detached from the document" },
    ],
    correctOptionId: "no",
    explanation:
      "createElement() and property assignments all happen off-screen. Nothing appears on the page until the node is actually inserted, e.g. via appendChild().",
  },
  remember:
    "Building an element is several separate steps — create it, configure it, then insert it. Only the insertion step (appendChild, etc.) actually changes what's on the page.",
};
