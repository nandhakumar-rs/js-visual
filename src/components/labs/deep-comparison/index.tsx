import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { DeepComparisonControls } from "./DeepComparisonControls";
import { DeepComparisonExperiment } from "./DeepComparisonExperiment";
import { DeepComparisonVisualization } from "./DeepComparisonVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { DeepComparisonInputs, DeepComparisonStepState } from "./types";

export const deepComparisonLab: LabDefinition<DeepComparisonInputs, DeepComparisonStepState> = {
  slug: "deep-comparison",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "shallow-vs-deep" },
  getCode,
  buildInitialSteps,
  simulationControls: DeepComparisonControls,
  Visualization: DeepComparisonVisualization,
  experimentPanel: DeepComparisonExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does the same pair get two different answers?",
    bullets: [
      <>
        A shallow check compares each pair of values with <InlineCode>===</InlineCode>, so on reaching two
        objects it answers with their identity and stops.
      </>,
      <>
        A deep check adds one rule: when both values are objects, ask the same question again about each
        key instead of answering.
      </>,
      <>
        That makes it recursive, and the call stack &mdash; not the function &mdash; keeps track of where
        it is in the data.
      </>,
      <>
        It needs base cases to terminate: identical values, non-objects, and{" "}
        <InlineCode>null</InlineCode>, which slips through the object check because{" "}
        <InlineCode>typeof null</InlineCode> is <InlineCode>&quot;object&quot;</InlineCode>.
      </>,
      <>
        One difference at any depth makes the whole answer false, and the walk stops at the first one it
        finds.
      </>,
    ],
    comparisonItems: [
      {
        label: "a === b",
        columns: [
          { header: "What it walks", value: "Nothing — identity only" },
          { header: "Cost", value: "One comparison" },
          { header: "Says equal when", value: "They are the same object" },
        ],
      },
      {
        label: "shallowEqual(a, b)",
        columns: [
          { header: "What it walks", value: "Own keys, one level" },
          { header: "Cost", value: "One per top-level key" },
          { header: "Says equal when", value: "Every value matches by ===" },
        ],
      },
      {
        label: "deepEqual(a, b)",
        columns: [
          { header: "What it walks", value: "Every value, all the way down" },
          { header: "Cost", value: "One per value in the tree" },
          { header: "Says equal when", value: "Every leaf matches" },
        ],
      },
    ],
    columnsHeader: "Check",
    technicalNote: (
      <>
        <span className="block">
          The cost is O(n) where n is the <em>total number of values</em>, not the number of keys at the
          top: comparing equal objects makes exactly one call per node, so a tree of 40 values costs 40
          comparisons and one of 121 costs 121. A mismatch short-circuits at the first difference in key
          order, which is why a difference in the first key costs two calls no matter how large the data is
          &mdash; and why one in the deepest leaf saves nothing at all. Key order does not affect the
          answer, unlike comparing <InlineCode>JSON.stringify</InlineCode> output, which reports{" "}
          <InlineCode>{"{ x: 1, y: 2 }"}</InlineCode> and <InlineCode>{"{ y: 2, x: 1 }"}</InlineCode> as
          different.
        </span>
        <span className="mt-2 block">
          A hand-written <InlineCode>deepEqual</InlineCode> has real limits worth naming out loud.{" "}
          <InlineCode>NaN</InlineCode> fails, because the leaf comparison is <InlineCode>===</InlineCode>{" "}
          &mdash; switch it to <InlineCode>Object.is</InlineCode> to fix that.{" "}
          <InlineCode>Date</InlineCode>, <InlineCode>Map</InlineCode>, <InlineCode>Set</InlineCode> and{" "}
          <InlineCode>RegExp</InlineCode> have no own enumerable keys, so any two of them look equal to a
          key-walking function. And an object that contains itself recurses until the stack overflows
          unless you track the pairs already visited. This is why production code reaches for a library
          rather than the four lines. The other question is whether to run it at all &mdash; doing this on
          every render, rather than storing the answer, is what the next lesson is about.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "What does this log, using the guarded deepEqual?",
    code: [
      'const a = { id: 1, address: { city: "Chennai" } };',
      'const b = { id: 1, address: { city: "Chennai" }, active: true };',
      "",
      "console.log(deepEqual(a, b));",
    ],
    options: [
      { id: "correct", label: "false" },
      {
        id: "true",
        label: "true",
        feedback:
          "Every key `a` has does match — which is exactly why the key-count guard exists. Without it this would be `true`, and swapping the arguments would give `false`.",
      },
      {
        id: "throws",
        label: "It throws",
        feedback:
          "Nothing here is `null` or a primitive where an object was expected, so the walk completes normally and simply reports a difference.",
      },
      {
        id: "undefined",
        label: "undefined — active has nothing to compare against",
        feedback:
          "The comparison never gets that far. The key counts differ, so the function returns `false` before walking a single key.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`b` has three keys and `a` has two, so the key-count guard returns `false` immediately. That guard is what makes the function symmetric — without it, the answer would depend on which object you passed first.",
  },

  challenge: {
    question:
      "This version throws `TypeError: Cannot convert undefined or null to object` on `deepEqual(null, { id: 1 })`. Which line fixes it?",
    code: [
      "function deepEqual(x, y) {",
      "  if (x === y) return true;",
      '  if (typeof x !== "object" || typeof y !== "object") return false;',
      "  ______",
      "  return Object.keys(x).every((key) => deepEqual(x[key], y[key]));",
      "}",
    ],
    options: [
      { id: "correct", label: "if (x === null || y === null) return false;" },
      {
        id: "typeof",
        label: "if (typeof x !== typeof y) return false;",
        feedback:
          "`typeof null` is `\"object\"`, the same as `typeof { id: 1 }` — so this guard never fires here and the call still reaches `Object.keys(null)`.",
      },
      {
        id: "keys",
        label: "if (Object.keys(x).length !== Object.keys(y).length) return false;",
        feedback:
          "This fixes a different hole (an extra key going unnoticed), but it calls `Object.keys(x)` itself — so on `null` it throws on this very line instead.",
      },
      {
        id: "array",
        label: "if (Array.isArray(x) !== Array.isArray(y)) return false;",
        feedback:
          "Also a real fix, for arrays being mistaken for objects. `Array.isArray(null)` is `false` and so is `Array.isArray({})`, so this guard lets `null` straight through.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`typeof null` is `\"object\"`, a long-standing quirk of the language, so `null` passes the object check and reaches `Object.keys(null)`, which throws. Ruling it out by hand is the only guard that closes this particular hole.",
  },

  remember:
    "A deep comparison is a shallow one that recurses instead of stopping: when both values are objects it asks the same question about each key, so a difference at any depth makes the whole answer false. It costs one comparison per value in the tree — linear in the total data, not in the top-level key count — and it needs base cases for identical values, non-objects and `null`, whose `typeof` is `\"object\"`.",
};
