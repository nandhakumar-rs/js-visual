import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { MemoizationControls } from "./MemoizationControls";
import { MemoizationExperiment } from "./MemoizationExperiment";
import { MemoizationVisualization } from "./MemoizationVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { MemoizationInputs, MemoizationStepState } from "./types";

export const memoizationLab: LabDefinition<MemoizationInputs, MemoizationStepState> = {
  slug: "memoization",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "hit-and-miss" },
  getCode,
  buildInitialSteps,
  simulationControls: MemoizationControls,
  Visualization: MemoizationVisualization,
  experimentPanel: MemoizationExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why is the cache key the whole design?",
    bullets: [
      <>
        Memoization is one extra step before the work: look the arguments up, and only calculate on a
        miss.
      </>,
      <>
        It trades memory for time &mdash; one stored entry per distinct input, one calculation saved per
        repeat &mdash; so its value is entirely the repeat rate.
      </>,
      <>
        &ldquo;Have I been asked this before?&rdquo; is an equality question, which is why this lesson
        comes last in the section.
      </>,
      <>
        A <InlineCode>Map</InlineCode> compares keys by identity, so an object argument hits only for a
        caller holding that exact object. A look-alike quietly gets its own entry.
      </>,
      <>
        It is only correct over a pure function. If the result depends on anything but the arguments, a
        stored answer can become a wrong one with no error to show for it.
      </>,
    ],
    comparisonItems: [
      {
        label: "A number or string",
        columns: [
          { header: "Hits when", value: "The values are equal" },
          { header: "Cost per lookup", value: "One hash lookup" },
          { header: "Fails on", value: "Nothing — but only works for primitives" },
        ],
      },
      {
        label: "An object, by identity",
        columns: [
          { header: "Hits when", value: "It is the very same object" },
          { header: "Cost per lookup", value: "One hash lookup" },
          { header: "Fails on", value: "Look-alikes — they miss and add a row" },
        ],
      },
      {
        label: "JSON.stringify(args)",
        columns: [
          { header: "Hits when", value: "The strings match" },
          { header: "Cost per lookup", value: "O(n) in the data, every call" },
          { header: "Fails on", value: "Key order, undefined, functions, cycles" },
        ],
      },
    ],
    columnsHeader: "Cache key",
    technicalNote: (
      <>
        <span className="block">
          Memoization is only sound over a <em>pure</em> function &mdash; same arguments, same result, no
          outside state read or written. Its classic win is recursive work with overlapping subproblems:
          computing <InlineCode>fib(30)</InlineCode> naively makes 2,692,537 calls, and with a cache it
          makes 31, because the naive version recomputes the same subtrees exponentially many times. The
          more ordinary win is far smaller and worth measuring before reaching for.
        </span>
        <span className="mt-2 block">
          And the costs are real. A cache that never hits is pure overhead, and a{" "}
          <InlineCode>Map</InlineCode> that only ever grows is a memory leak &mdash; which is what a
          bounded cache, or a <InlineCode>WeakMap</InlineCode> keyed by object identity so entries can be
          collected, exists to solve. A cached impure function serves stale answers silently. And a key
          built by stringifying the arguments fails in both directions at once: it collides (
          <InlineCode>undefined</InlineCode> and <InlineCode>null</InlineCode> both become{" "}
          <InlineCode>[null]</InlineCode>, and a dropped <InlineCode>undefined</InlineCode> value makes{" "}
          <InlineCode>{"{ a: undefined }"}</InlineCode> indistinguishable from <InlineCode>{"{}"}</InlineCode>
          ) and it splits (<InlineCode>{"{ x: 1, y: 2 }"}</InlineCode> and{" "}
          <InlineCode>{"{ y: 2, x: 1 }"}</InlineCode> are different keys for the same data). That is the
          thread running through this whole section: what counts as &ldquo;the same&rdquo;, what it costs
          to check, and what you can safely do with the answer.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "How many times does the calculation actually run?",
    code: [
      "const cache = new Map();",
      "",
      "function areaFor(box) {",
      "  if (cache.has(box)) return cache.get(box);",
      "  const result = box.w * box.h;",
      "  cache.set(box, result);",
      "  return result;",
      "}",
      "",
      "const box = { w: 3, h: 4 };",
      "",
      "areaFor(box);",
      "areaFor(box);",
      "areaFor({ w: 3, h: 4 });",
    ],
    options: [
      { id: "two", label: "2" },
      {
        id: "one",
        label: "1 — every call has the same dimensions",
        feedback:
          "The dimensions match, but the third argument is a different object. A `Map` key is compared by identity, so it misses.",
      },
      {
        id: "three",
        label: "3 — an object can't be used as a Map key",
        feedback:
          "It can. The second call is a genuine hit, because it hands over the very same object the first call stored.",
      },
      {
        id: "zero",
        label: "0 — the results are all cached in advance",
        feedback:
          "Nothing is cached until a call misses and does the work. The cache starts empty every time.",
      },
    ],
    correctOptionId: "two",
    explanation:
      "The first call misses and calculates. The second hands over the same object, so it hits. The third is a look-alike — a different object — so it misses, calculates the same `12` again, and adds a second row holding an identical value.",
  },

  challenge: {
    question:
      "This wrapper keys its cache with `JSON.stringify(args)`. Which pair of calls makes it return an answer that is not just unoptimised, but actually wrong?",
    code: [
      "const describe = memoize((o) => Object.keys(o).length + \" keys\");",
      "",
      "// key = JSON.stringify([o])",
    ],
    options: [
      { id: "correct", label: "describe({ a: undefined }) then describe({})" },
      {
        id: "order",
        label: "describe({ x: 1, y: 2 }) then describe({ y: 2, x: 1 })",
        feedback:
          "These key differently, so the second one misses and recalculates. Wasteful — but both answers are correct, which is a much cheaper kind of bug.",
      },
      {
        id: "same",
        label: "describe(user) then describe(user), the same object twice",
        feedback:
          "Identical arguments produce an identical key, so this is a hit that returns exactly the right answer. This is the case memoization is for.",
      },
      {
        id: "numbers",
        label: "describe({ a: 1 }) then describe({ b: 2 })",
        feedback:
          "Different keys, so the second misses and calculates its own answer. Both results are right — no saving, no error.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`JSON.stringify` drops `undefined` values, so both objects produce the key `[{}]`. The second call hits and returns `\"1 keys\"` for an object with none — the function is never even called. A wrong answer from a false hit is the failure worth fearing; the others merely lose you the optimisation.",
  },

  remember:
    "Memoization stores a function's result under a key built from its arguments: a miss calculates and stores, a hit returns the stored value. It trades memory for time, so its value is the repeat rate — with no repeats it is pure overhead and a cache that never shrinks. It is only correct for a pure function, and the key decides everything: a `Map` matches objects by identity, while a stringified key both collides and splits.",
};
