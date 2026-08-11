import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ConcatArraysControls } from "./ConcatArraysControls";
import { ConcatArraysVisualization } from "./ConcatArraysVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ConcatArraysInputs, ConcatArraysStepState } from "./types";

export const concatenatingArraysLab: LabDefinition<ConcatArraysInputs, ConcatArraysStepState> = {
  slug: "concatenating-arrays",
  mode: "scripted",
  layout: "guided",
  showWhyPanel: false,
  defaultInputs: { a: [1, 2], b: [3, 4], mode: "concat" },
  getCode,
  buildInitialSteps,
  simulationControls: ConcatArraysControls,
  Visualization: ConcatArraysVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "What concat() did",
    bullets: [
      <>
        <InlineCode>concat()</InlineCode> created a new result array.
      </>,
      <>
        It placed the items from <InlineCode>a</InlineCode> first, then the items from{" "}
        <InlineCode>b</InlineCode>.
      </>,
      <>It left both source arrays unchanged.</>,
    ],
    technicalNote: (
      <>
        <InlineCode>concat()</InlineCode> returns a new array and does not mutate{" "}
        <InlineCode>a</InlineCode> or <InlineCode>b</InlineCode>. It&apos;s a shallow operation — for
        example, given <InlineCode>const user = {"{ name: \"Maya\" }"}</InlineCode> and{" "}
        <InlineCode>const a = [user]</InlineCode>, the outer array returned by{" "}
        <InlineCode>a.concat([])</InlineCode> is new, but the object inside it is still the same{" "}
        <InlineCode>user</InlineCode> object. For these simple arrays,{" "}
        <InlineCode>a.concat(b)</InlineCode> and <InlineCode>[...a, ...b]</InlineCode> produce the same
        visible result, but they are not identical in every JavaScript edge case.
      </>
    ),
  },

  prediction: {
    code: [
      'const first = ["red", "blue"];',
      'const second = ["green"];',
      "const colors = first.concat(second);",
    ],
    options: [
      { id: "correct", label: '["red", "blue", "green"]' },
      { id: "reversed", label: '["green", "red", "blue"]' },
      { id: "nested", label: '[["red", "blue"], ["green"]]' },
    ],
    correctOptionId: "correct",
    explanation:
      "`concat()` places the first array's items before the second array's items, so `colors` becomes `[\"red\", \"blue\", \"green\"]`.",
  },

  challenge: {
    question:
      "Choose the code that creates one array containing all four tasks in the correct order without changing either source array.",
    code: [
      'const morning = ["Email", "Plan"];',
      'const afternoon = ["Build", "Review"];',
      "",
      "const wholeDay = ________;",
    ],
    options: [
      { id: "correct", label: "morning.concat(afternoon)" },
      { id: "reversed", label: "afternoon.concat(morning)" },
      { id: "nested", label: "[morning, afternoon]" },
    ],
    correctOptionId: "correct",
    explanation:
      '`morning.concat(afternoon)` gives `["Email", "Plan", "Build", "Review"]` — the reversed version would put afternoon tasks first, and `[morning, afternoon]` nests two arrays inside one instead of combining their items.',
  },

  remember:
    "Concatenation joins arrays in order and returns a new array. The source arrays stay unchanged.",
};
