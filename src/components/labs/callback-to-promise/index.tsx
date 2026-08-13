import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { CallbackToPromiseControls } from "./CallbackToPromiseControls";
import { CallbackToPromiseExperiment } from "./CallbackToPromiseExperiment";
import { CallbackToPromiseVisualization } from "./CallbackToPromiseVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { PromisesInputs, PromisesStepState } from "./types";

export const callbackToPromiseLab: LabDefinition<PromisesInputs, PromisesStepState> = {
  slug: "callback-to-promise",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "value" },
  getCode,
  buildInitialSteps,
  simulationControls: CallbackToPromiseControls,
  Visualization: CallbackToPromiseVisualization,
  experimentPanel: CallbackToPromiseExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does a promise chain stay flat?",
    bullets: [
      <>
        <InlineCode>getUser(1)</InlineCode> returns a promise immediately &mdash; a value standing in for a
        result that has not arrived yet.
      </>,
      <>
        Because it is a value, you can name it, return it from a function, or hand it to someone else. A
        callback&apos;s result could only ever be reached inside the callback.
      </>,
      <>
        <InlineCode>.then</InlineCode> returns a <em>new</em> promise, so the next handler attaches to that one.
        The handlers form a list rather than a nesting.
      </>,
      <>
        Returning a promise from inside a handler makes the chain wait for it, which is how each step still feeds
        the next without indenting.
      </>,
      <>
        A rejection skips every remaining <InlineCode>.then</InlineCode> and reaches the first{" "}
        <InlineCode>.catch</InlineCode>, so one handler covers the whole chain.
      </>,
    ],
    comparisonItems: [
      {
        label: "Nested callbacks",
        columns: [
          { header: "Indentation", value: "3 levels" },
          { header: "Error handling", value: "3 checks, one per level" },
          { header: "Lines", value: "10" },
        ],
      },
      {
        label: "Named functions",
        columns: [
          { header: "Indentation", value: "1 level" },
          { header: "Error handling", value: "Still 3 checks" },
          { header: "Lines", value: "16" },
        ],
      },
      {
        label: "Promise chain",
        columns: [
          { header: "Indentation", value: "1 level" },
          { header: "Error handling", value: "One .catch() for all three" },
          { header: "Lines", value: "5" },
        ],
      },
    ],
    columnsHeader: "Shape",
    technicalNote: (
      <>
        <span className="block">
          A promise is a state machine with exactly one transition to make: pending to fulfilled, or pending to
          rejected, permanently. That permanence is what makes it safe to pass around &mdash; nobody downstream
          can change what it settled to, and a handler attached long after it settled still receives the value
          rather than missing it.
        </span>
        <span className="mt-2 block">
          <InlineCode>.then</InlineCode> always returns a new promise, and the rule for what that promise does is
          uniform: returning a plain value fulfils it with that value, returning a promise makes it adopt that
          promise&apos;s eventual outcome, and throwing rejects it. That one rule is what makes chaining work and
          what routes any failure past the remaining handlers to the next{" "}
          <InlineCode>.catch</InlineCode>. <em>When</em> those handlers run relative to other pending work is the
          Microtask Queue lesson; writing this same chain as ordinary top-to-bottom statements is Async / Await.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "What does the second `.then` log?",
    code: [
      "getUser(1)",
      "  .then((user) => {",
      "    getOrders(user.id);",
      "  })",
      "  .then((orders) => {",
      "    console.log(orders);",
      "  });",
    ],
    options: [
      { id: "undefined", label: "undefined" },
      {
        id: "orders",
        label: "The orders",
        feedback:
          "The first handler calls `getOrders` but never returns it, so the chain does not wait for it and never receives its value.",
      },
      {
        id: "nothing",
        label: "Nothing — the second .then never runs",
        feedback:
          "It does run. The first handler finished without throwing, so the promise it returned fulfilled — just with `undefined`.",
      },
      {
        id: "promise",
        label: "A pending Promise",
        feedback:
          "`getOrders(user.id)` does produce a promise, but it was discarded rather than returned. What flows on is the handler's return value, which is `undefined`.",
      },
    ],
    correctOptionId: "undefined",
    explanation:
      "A `.then` handler with no `return` completes with `undefined`, and that is what fulfils the promise it handed back. Putting `return` in front of `getOrders(user.id)` makes the chain wait for it and pass the orders along.",
  },

  challenge: {
    question: "Choose the line that correctly settles this promise from the callback's result.",
    code: [
      "function getUser(id) {",
      "  return new Promise((resolve, reject) => {",
      "    getUserCb(id, (error, user) => {",
      "      ______",
      "    });",
      "  });",
      "}",
    ],
    options: [
      { id: "correct", label: "if (error) reject(error); else resolve(user);" },
      {
        id: "throw",
        label: "if (error) throw error; else return user;",
        feedback:
          "The callback runs long after the executor returned, so there is nothing left to catch the `throw` — and returning from a callback sends the value nowhere.",
      },
      {
        id: "both",
        label: "resolve(user); reject(error);",
        feedback:
          "A promise settles once, and the first call wins — so this always fulfils, even on failure, handing back the `null` user instead of the error.",
      },
      {
        id: "two-args",
        label: "resolve(error, user);",
        feedback:
          "`resolve` takes a single value, so the extra argument is dropped and the promise fulfils with the error object itself — rejection is a separate function, not a second slot.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`resolve` and `reject` are the two ways to settle the promise, and the error-first callback tells you which to call. This is what promisifying means: giving a callback-based function a promise to hand back.",
  },

  remember:
    "A promise is a value that stands for a result that has not arrived yet. Because `.then` returns a new promise, dependent steps form a flat chain instead of a pyramid — and because a rejection skips to the first `.catch`, one handler covers every step.",
};
