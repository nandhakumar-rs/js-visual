import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { RangeControls } from "./RangeControls";
import { RangeVisualization } from "./RangeVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { RangeInputs, RangeStepState } from "./types";

export const rangeLab: LabDefinition<RangeInputs, RangeStepState> = {
  slug: "range",
  mode: "scripted",
  layout: "guided",
  showConsole: false,
  showWhyPanel: false,
  defaultInputs: { start: 2, end: 8, step: 1 },
  getCode,
  buildInitialSteps,
  simulationControls: RangeControls,
  Visualization: RangeVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "What the range function did",
    bullets: [
      <>
        The sequence begins with <InlineCode>start</InlineCode>, so the start is included.
      </>,
      <>
        Each collected value is followed by <InlineCode>value += step</InlineCode>.
      </>,
      <>
        The loop stops before <InlineCode>end</InlineCode>, so the end is excluded.
      </>,
      <>A positive step moves upward; a negative step moves downward.</>,
      <>The function returns a new array containing the collected values.</>,
    ],
    comparisonItems: [
      {
        label: "start",
        columns: [
          { header: "Meaning", value: "First included value" },
          { header: "Example", value: "2" },
        ],
      },
      {
        label: "end",
        columns: [
          { header: "Meaning", value: "Excluded stopping boundary" },
          { header: "Example", value: "8" },
        ],
      },
      {
        label: "step",
        columns: [
          { header: "Meaning", value: "Amount added each time" },
          { header: "Example", value: "1" },
        ],
      },
    ],
    technicalNote: (
      <>
        JavaScript has no native general-purpose <InlineCode>range()</InlineCode> helper, so <InlineCode>step</InlineCode>{" "}
        of <InlineCode>0</InlineCode> must be rejected to prevent a non-advancing loop, and positive and negative
        steps require different boundary comparisons (<InlineCode>{"<"}</InlineCode> vs <InlineCode>{">"}</InlineCode>
        ). An incompatible direction naturally produces an empty range rather than an error. Large requested ranges
        are capped in this interactive learning UI, and this lesson accepts integers only to avoid floating-point
        accumulation surprises.
      </>
    ),
  },

  prediction: {
    code: ["range(2, 8, 2)"],
    options: [
      { id: "a", label: "[2, 4, 6]" },
      { id: "b", label: "[2, 4, 6, 8]" },
      { id: "c", label: "[2, 3, 4, 5, 6, 7]" },
      { id: "d", label: "[2, 8]" },
    ],
    correctOptionId: "a",
    explanation:
      "2 is included as the start. Adding the step of 2 produces 4, then 6. 8 is excluded because it is the end boundary, not a value in the range.",
  },

  challenge: {
    question: "Choose the range call that creates [5, 10, 15].",
    code: ["const checkpoints = ______;"],
    options: [
      { id: "a", label: "range(5, 20, 5)" },
      { id: "b", label: "range(5, 15, 5)" },
      { id: "c", label: "range(5, 20, 1)" },
      { id: "d", label: "range(20, 5, 5)" },
    ],
    correctOptionId: "a",
    explanation:
      "range(5, 20, 5) starts at 5, adds 5 each time, and stops before 20 — producing [5, 10, 15]. range(5, 15, 5) stops before 15, producing only [5, 10]. range(5, 20, 1) uses the wrong step and counts by ones. range(20, 5, 5) has a positive step that moves away from the lower end, so it produces an empty range.",
  },

  remember:
    "A range includes `start`, excludes `end`, and adds `step` after each value. The step must never be `0`, and its sign controls whether the range moves upward or downward.",
};
