import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { SplitSentencesControls } from "./SplitSentencesControls";
import { SplitSentencesVisualization } from "./SplitSentencesVisualization";
import type { SplitSentencesInputs, SplitSentencesStepState } from "./types";

export const splitSentencesLab: LabDefinition<SplitSentencesInputs, SplitSentencesStepState> = {
  slug: "split-sentences",
  mode: "scripted",
  defaultInputs: { text: "Hello world. How are you? JavaScript is fun." },
  getCode,
  buildInitialSteps,
  Controls: SplitSentencesControls,
  Visualization: SplitSentencesVisualization,
  challenge: {
    question: '"Hello world. How are you?".split(/(?<=[.?!])\\s+/) returns an array of:',
    options: [
      { id: "a", label: '["Hello world.", "How are you?"]' },
      { id: "b", label: '["Hello", "world.", "How", "are", "you?"]' },
      { id: "c", label: '["Hello world. How are you?"]' },
    ],
    correctOptionId: "a",
    explanation:
      "The regex splits right after a sentence-ending punctuation mark followed by whitespace, so each sentence (punctuation included) becomes its own array element.",
  },
  remember:
    "A paragraph can be split into sentences by matching sentence-ending punctuation (. ? !) followed by whitespace, and splitting right after it.",
};
