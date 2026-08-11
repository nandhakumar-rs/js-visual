import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { SortingControls } from "./SortingControls";
import { SortingVisualization } from "./SortingVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { SortingInputs, SortingStepState } from "./types";

export const sortingLab: LabDefinition<SortingInputs, SortingStepState> = {
  slug: "sorting",
  mode: "scripted",
  layout: "guided",
  showConsole: false,
  showWhyPanel: false,
  defaultInputs: { values: [10, 1, 2, 20], mode: "default" },
  getCode,
  buildInitialSteps,
  simulationControls: SortingControls,
  Visualization: SortingVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "What sorting did",
    bullets: [
      <>
        <InlineCode>sort()</InlineCode> arranges values using a comparison rule.
      </>,
      <>Without a comparator, values are compared as strings.</>,
      <>
        <InlineCode>(a, b) =&gt; a - b</InlineCode> gives ascending numeric order;{" "}
        <InlineCode>(a, b) =&gt; b - a</InlineCode> gives descending order.
      </>,
      <>
        <InlineCode>sort()</InlineCode> changes the original array and returns that same array.
      </>,
      <>
        <InlineCode>toSorted()</InlineCode> returns a new array and leaves the original unchanged.
      </>,
    ],
    comparisonItems: [
      {
        label: "sort()",
        columns: [
          { header: "Numeric order", value: "No comparator: text order" },
          { header: "Changes source?", value: "Yes" },
          { header: "Result reference", value: "Same array" },
        ],
      },
      {
        label: "sort((a,b) => a-b)",
        columns: [
          { header: "Numeric order", value: "Ascending" },
          { header: "Changes source?", value: "Yes" },
          { header: "Result reference", value: "Same array" },
        ],
      },
      {
        label: "sort((a,b) => b-a)",
        columns: [
          { header: "Numeric order", value: "Descending" },
          { header: "Changes source?", value: "Yes" },
          { header: "Result reference", value: "Same array" },
        ],
      },
      {
        label: "toSorted((a,b) => a-b)",
        columns: [
          { header: "Numeric order", value: "Ascending" },
          { header: "Changes source?", value: "No" },
          { header: "Result reference", value: "New array" },
        ],
      },
    ],
    technicalNote: (
      <>
        Default <InlineCode>sort()</InlineCode> converts non-<InlineCode>undefined</InlineCode> elements to strings
        and compares{" "}
        <InfoTooltip label="UTF-16 code units">
          The 16-bit units JavaScript strings are made of internally — comparing them character by character is what
          produces text/lexicographic order.
        </InfoTooltip>{" "}
        in sequence. A comparator should return a negative number, a positive number, or zero — not necessarily only{" "}
        <InlineCode>-1</InlineCode>, <InlineCode>1</InlineCode>, or <InlineCode>0</InlineCode> — and should be pure
        and consistent for the same pair of values. Modern JavaScript specifies{" "}
        <InfoTooltip label="stable sorting">
          Values the comparator treats as equal keep their original relative order instead of being shuffled.
        </InfoTooltip>
        , and <InlineCode>localeCompare()</InlineCode> is commonly used when sorting human-language strings.{" "}
        <InlineCode>toSorted()</InlineCode> follows the same comparison rules as <InlineCode>sort()</InlineCode> but
        returns a new array.
      </>
    ),
  },

  prediction: {
    code: ["const scores = [100, 3, 20];", "const ranked = scores.toSorted((a, b) => a - b);"],
    options: [
      { id: "a", label: "ranked is [3, 20, 100]; scores is [100, 3, 20]" },
      { id: "b", label: "Both are [3, 20, 100]" },
      { id: "c", label: "ranked is [100, 20, 3]; scores is unchanged" },
      { id: "d", label: "ranked is [100, 20, 3]; both arrays change" },
    ],
    correctOptionId: "a",
    explanation:
      "`a - b` creates ascending numeric order, so `ranked` is `[3, 20, 100]`. `toSorted()` creates a different array and leaves `scores` untouched at `[100, 3, 20]`.",
  },

  challenge: {
    question: "Choose the code that creates a new ascending array without changing scores.",
    code: ["const scores = [42, 7, 100, 18];", "const ascending = ________;"],
    options: [
      { id: "a", label: "scores.toSorted((a, b) => a - b)" },
      { id: "b", label: "scores.sort((a, b) => a - b)" },
      { id: "c", label: "scores.toSorted()" },
      { id: "d", label: "[scores].sort((a, b) => a - b)" },
    ],
    correctOptionId: "a",
    explanation:
      "`scores.toSorted((a, b) => a - b)` gives ascending numeric order and preserves `scores`. `scores.sort((a, b) => a - b)` has the correct order but mutates `scores`. `scores.toSorted()` preserves `scores` but uses text order, not numeric. `[scores].sort((a, b) => a - b)` creates a nested array and never sorts the numbers inside it.",
  },

  remember:
    "Default `sort()` compares values as text. Use `a - b` for ascending numbers and `b - a` for descending numbers. `sort()` mutates the source; `toSorted()` creates a new array.",
};
