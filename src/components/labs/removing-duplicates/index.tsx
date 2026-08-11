import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { DedupControls } from "./DedupControls";
import { DedupVisualization } from "./DedupVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { DedupInputs, DedupStepState } from "./types";

export const removingDuplicatesLab: LabDefinition<DedupInputs, DedupStepState> = {
  slug: "removing-duplicates",
  mode: "scripted",
  layout: "guided",
  showConsole: false,
  showWhyPanel: false,
  defaultInputs: { values: [1, 2, 2, 3, 1], method: "set" },
  getCode,
  buildInitialSteps,
  simulationControls: DedupControls,
  Visualization: DedupVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "What removing duplicates did",
    bullets: [
      <>JavaScript checks the values from left to right.</>,
      <>The first occurrence of each value is kept.</>,
      <>Later occurrences of the same value are skipped.</>,
      <>The first-seen order is preserved.</>,
      <>A new array is created while the original array remains unchanged.</>,
    ],
    comparisonItems: [
      {
        label: "Set",
        description: "Keeps unique values directly.",
      },
      {
        label: "filter + indexOf",
        description: "Keeps a value only at its first position.",
      },
      {
        label: "reduce + includes",
        description: "Manually builds a result containing values not already present.",
      },
    ],
    technicalNote: (
      <>
        <InlineCode>Set</InlineCode> uses{" "}
        <InfoTooltip label="SameValueZero equality">
          The same equality Set, Map, and includes() use — identical to ===, except NaN equals itself and +0/-0 are
          treated as the same value.
        </InfoTooltip>
        , so repeated <InlineCode>NaN</InlineCode> values collapse into one, and <InlineCode>+0</InlineCode>/
        <InlineCode>-0</InlineCode> are treated as the same value. Objects are compared by reference, so two separate{" "}
        <InlineCode>{"{ id: 1 }"}</InlineCode> objects are not duplicates merely because their contents look equal.
        Set-based deduplication is typically{" "}
        <InfoTooltip label="O(n)" code>
          The number of steps grows roughly in proportion to the array&apos;s length — a &quot;linear&quot; amount of
          work.
        </InfoTooltip>{" "}
        on average, while <InlineCode>filter()</InlineCode> with <InlineCode>indexOf()</InlineCode> and{" "}
        <InlineCode>reduce()</InlineCode> with <InlineCode>includes()</InlineCode> are both{" "}
        <InfoTooltip label="O(n²)" code>
          The number of steps grows with the square of the array&apos;s length — each value is checked against every
          value kept so far, so doubling the array roughly quadruples the work.
        </InfoTooltip>{" "}
        in the worst case.
      </>
    ),
  },

  prediction: {
    code: ['const tags = ["js", "css", "js", "react", "css"];', "const uniqueTags = [...new Set(tags)];"],
    options: [
      { id: "a", label: '["js", "css", "react"]' },
      { id: "b", label: '["js", "css", "js", "react", "css"]' },
      { id: "c", label: '["react", "css", "js"]' },
      { id: "d", label: 'Set(3) { "js", "css", "react" }' },
    ],
    correctOptionId: "a",
    explanation:
      'Repeated values disappear because a Set only stores each value once, and the first-seen order is preserved — "js" and "css" keep their original positions. The result is a plain array, not a Set, because spreading a Set with `[...]` collects its values into a new array.',
  },

  challenge: {
    question: "Choose the code that creates a new array containing each attendee name once.",
    code: ['const attendees = ["Maya", "Alex", "Maya", "John"];', "const uniqueAttendees = ________;"],
    options: [
      { id: "a", label: "[...new Set(attendees)]" },
      { id: "b", label: "new Set(attendees)" },
      { id: "c", label: "[attendees]" },
      { id: "d", label: "attendees.map(name => name)" },
    ],
    correctOptionId: "a",
    explanation:
      "`[...new Set(attendees)]` removes duplicates and returns an array. `new Set(attendees)` also removes duplicates, but it returns a Set rather than an array. `[attendees]` creates a nested array and keeps every duplicate. `attendees.map(name => name)` creates a new array but doesn't remove duplicates.",
  },

  remember:
    "`new Set(values)` keeps one occurrence of each value. Spreading that Set with `[...set]` creates a new array, while the source array stays unchanged.",
};
