import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ShallowComparisonControls } from "./ShallowComparisonControls";
import { ShallowComparisonExperiment } from "./ShallowComparisonExperiment";
import { ShallowComparisonVisualization } from "./ShallowComparisonVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ShallowComparisonInputs, ShallowComparisonStepState } from "./types";

export const shallowComparisonLab: LabDefinition<
  ShallowComparisonInputs,
  ShallowComparisonStepState
> = {
  slug: "shallow-comparison",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "look-alikes" },
  getCode,
  buildInitialSteps,
  simulationControls: ShallowComparisonControls,
  Visualization: ShallowComparisonVisualization,
  experimentPanel: ShallowComparisonExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why are two identical-looking objects not equal?",
    bullets: [
      <>
        Every object literal that runs creates a new object with its own identity. Two literals can never
        produce the same one.
      </>,
      <>
        For objects, <InlineCode>===</InlineCode> compares identity, not contents &mdash; it never reads a
        single property before answering.
      </>,
      <>
        For primitives it compares the values themselves, which is why{" "}
        <InlineCode>a.id === b.id</InlineCode> can be true while <InlineCode>a === b</InlineCode> is false.
      </>,
      <>
        A shallow check walks both objects&apos; own keys and compares each pair with{" "}
        <InlineCode>===</InlineCode> &mdash; so it answers &ldquo;same contents?&rdquo; only while those
        contents are primitives.
      </>,
      <>
        A nested object is reached by a reference the parent holds, so the same identity rule applies one
        level down &mdash; and the check stops there.
      </>,
    ],
    comparisonItems: [
      {
        label: "const b = a",
        columns: [
          { header: "a === b", value: "true" },
          { header: "shallowEqual(a, b)", value: "true" },
          { header: "Nested still shared?", value: "Yes — it is the same object" },
        ],
      },
      {
        label: "const b = { ...a }",
        columns: [
          { header: "a === b", value: "false" },
          { header: "shallowEqual(a, b)", value: "true" },
          { header: "Nested still shared?", value: "Yes — the reference was copied" },
        ],
      },
      {
        label: "A same-shape literal",
        columns: [
          { header: "a === b", value: "false" },
          { header: "shallowEqual(a, b)", value: "false" },
          { header: "Nested still shared?", value: "No — a new nested object" },
        ],
      },
    ],
    columnsHeader: "How b is made",
    technicalNote: (
      <>
        <span className="block">
          <InlineCode>===</InlineCode> compares primitives by value and everything else by identity, with two
          edge cases worth knowing: <InlineCode>NaN === NaN</InlineCode> is <InlineCode>false</InlineCode>{" "}
          while <InlineCode>Object.is(NaN, NaN)</InlineCode> is <InlineCode>true</InlineCode>, and{" "}
          <InlineCode>Object.is(0, -0)</InlineCode> is <InlineCode>false</InlineCode> where{" "}
          <InlineCode>===</InlineCode> says true. <InlineCode>Set</InlineCode> and{" "}
          <InlineCode>Map</InlineCode> key on SameValueZero, which is identity for objects &mdash; so two
          look-alike objects are two separate entries, and looking one up with a fresh object returns{" "}
          <InlineCode>undefined</InlineCode>. <InlineCode>==</InlineCode> is a different operator that
          coerces first (<InlineCode>[] == false</InlineCode> is <InlineCode>true</InlineCode>), which is why{" "}
          <InlineCode>===</InlineCode> is the default.
        </span>
        <span className="mt-2 block">
          Comparing <InlineCode>JSON.stringify</InlineCode> output looks like a shortcut past all of this, and
          it is a trap: it depends on key order, so <InlineCode>{"{ x: 1, y: 2 }"}</InlineCode> and{" "}
          <InlineCode>{"{ y: 2, x: 1 }"}</InlineCode> stringify differently despite holding the same data. It
          also drops <InlineCode>undefined</InlineCode> values and functions, and throws on a cycle. Comparing
          nested data properly means walking it &mdash; which is the next lesson, Shallow vs Deep Comparison.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "What do these two lines log?",
    code: [
      "const a = { n: 1 };",
      "const b = { ...a };",
      "",
      "console.log(a === b);",
      "console.log(shallowEqual(a, b));",
    ],
    options: [
      { id: "correct", label: "false, then true" },
      {
        id: "both-true",
        label: "true, then true",
        feedback:
          "Spread always builds a new object — that is the point of using it. So `a === b` compares two different identities and is `false`.",
      },
      {
        id: "both-false",
        label: "false, then false",
        feedback:
          "The shallow check does not compare the objects themselves. It compares their values, and `n` is `1` on both sides.",
      },
      {
        id: "true-false",
        label: "true, then false",
        feedback:
          "This has it backwards: identity is what fails here, and the key-by-key comparison is what succeeds.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`{ ...a }` copies the values of `a`'s own keys into a brand-new object, so the two are different objects holding equal values. `===` reports the difference in identity; the shallow check reports the sameness of the contents.",
  },

  challenge: {
    question:
      "You received a look-alike `target` from elsewhere and need the matching user's position in `users`. Choose the line that works.",
    code: ['const users = [{ id: 1, tags: ["admin"] }];', 'const target = { id: 1, tags: ["admin"] };', "", "const index = ______;"],
    options: [
      { id: "correct", label: "users.findIndex((u) => u.id === target.id)" },
      {
        id: "indexof",
        label: "users.indexOf(target)",
        feedback:
          "`indexOf` compares by identity, and `target` is a different object from the one in the array — so this is always `-1`.",
      },
      {
        id: "findindex-identity",
        label: "users.findIndex((u) => u === target)",
        feedback:
          "Switching to `findIndex` changes nothing while the callback still compares with `===` on the objects themselves. Also `-1`.",
      },
      {
        id: "indexof-id",
        label: "users.indexOf(target.id)",
        feedback:
          "This looks for the number `1` in an array of objects. Nothing in it is a number, so this is `-1` too.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "When the object you hold is not the one in the array, you have to compare something inside it instead — a stable id is the usual choice. This is why lists of records carry ids rather than relying on the objects themselves.",
  },

  remember:
    "For objects, `===` asks which object, not which contents — so two identical-looking literals are never equal, and only sharing makes two names compare true. A shallow check walks the own keys and compares each pair with `===`, which answers \"same contents?\" for primitives but falls back to identity the moment a value is another object.",
};
