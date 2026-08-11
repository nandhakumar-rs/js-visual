import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { HighlightControls } from "./HighlightControls";
import { HighlightVisualization } from "./HighlightVisualization";
import type { HighlightInputs, HighlightStepState } from "./types";

export const highlightLongWordsLab: LabDefinition<HighlightInputs, HighlightStepState> = {
  slug: "highlight-long-words",
  mode: "scripted",
  defaultInputs: { text: "JavaScript makes the web interactive and fun", threshold: 8 },
  getCode,
  buildInitialSteps,
  Controls: HighlightControls,
  Visualization: HighlightVisualization,
  challenge: {
    question: 'Given threshold = 8, which word from "JavaScript makes the web interactive" gets wrapped in <mark>?',
    options: [
      { id: "javascript", label: "JavaScript (10 letters)" },
      { id: "makes", label: "makes (5 letters)" },
      { id: "web", label: "web (3 letters)" },
    ],
    correctOptionId: "javascript",
    explanation: '"JavaScript" has 10 characters, which is greater than the threshold of 8 — the other words are all shorter than that.',
  },
  remember:
    "Highlighting long words is just: split text into words, check each word's length against a threshold, and rebuild the string wrapping matches in <mark> — then the DOM re-renders with the new markup.",
};
