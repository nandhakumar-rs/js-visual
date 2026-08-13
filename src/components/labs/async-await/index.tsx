import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { AsyncAwaitControls } from "./AsyncAwaitControls";
import { AsyncAwaitExperiment } from "./AsyncAwaitExperiment";
import { AsyncAwaitVisualization } from "./AsyncAwaitVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { AsyncAwaitInputs, AsyncAwaitStepState } from "./types";

export const asyncAwaitLab: LabDefinition<AsyncAwaitInputs, AsyncAwaitStepState> = {
  slug: "async-await",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "top-to-bottom" },
  getCode,
  buildInitialSteps,
  simulationControls: AsyncAwaitControls,
  Visualization: AsyncAwaitVisualization,
  experimentPanel: AsyncAwaitExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why can asynchronous code be written as ordinary statements?",
    bullets: [
      <>
        Calling an <InlineCode>async</InlineCode> function is not deferred. Its body runs immediately, in the
        same tick as the call, up to the first <InlineCode>await</InlineCode>.
      </>,
      <>
        At an <InlineCode>await</InlineCode> the function is lifted <em>off</em> the call stack and parked with
        its line number and its variables. The stack is free again straight away.
      </>,
      <>
        When the promise settles, the rest of the function is queued as a microtask &mdash; the same queue as a{" "}
        <InlineCode>.then</InlineCode> handler, because that is exactly what it is.
      </>,
      <>
        On resuming, the fulfilled value <em>becomes</em> the value of the <InlineCode>await</InlineCode>{" "}
        expression, so it binds to a normal <InlineCode>const</InlineCode> in the function&apos;s own scope.
      </>,
      <>
        A rejection is turned back into a <InlineCode>throw</InlineCode> at the awaiting line, which is what
        finally lets an ordinary <InlineCode>try</InlineCode>/<InlineCode>catch</InlineCode> cover
        asynchronous work.
      </>,
    ],
    comparisonItems: [
      {
        label: "Nested callbacks",
        columns: [
          { header: "Reading order", value: "Outside in, one level per step" },
          { header: "Error handling", value: "One check per level" },
          { header: "Where results live", value: "Only inside the callback" },
        ],
      },
      {
        label: ".then chain",
        columns: [
          { header: "Reading order", value: "Top to bottom, inside handlers" },
          { header: "Error handling", value: "One .catch for the chain" },
          { header: "Where results live", value: "Only inside each handler" },
        ],
      },
      {
        label: "async / await",
        columns: [
          { header: "Reading order", value: "Top to bottom, plain statements" },
          { header: "Error handling", value: "An ordinary try/catch" },
          { header: "Where results live", value: "Named consts in one scope" },
        ],
      },
    ],
    columnsHeader: "Style",
    technicalNote: (
      <>
        <span className="block">
          An <InlineCode>async</InlineCode> function always returns a promise, whatever is written inside it:{" "}
          <InlineCode>return 42</InlineCode> fulfils that promise with <InlineCode>42</InlineCode> rather than
          handing back <InlineCode>42</InlineCode>, and a <InlineCode>throw</InlineCode> rejects it instead of
          propagating to the caller. So a caller that is not itself async still needs{" "}
          <InlineCode>.then</InlineCode> or <InlineCode>.catch</InlineCode> &mdash; and an{" "}
          <InlineCode>await</InlineCode> on a value that is not a promise still yields to the microtask queue
          before continuing. One consequence catches people out:{" "}
          <InlineCode>return getOrders()</InlineCode> inside a <InlineCode>try</InlineCode> is{" "}
          <em>not</em> caught by that <InlineCode>try</InlineCode>, because the function has already returned by
          the time the promise rejects. <InlineCode>return await getOrders()</InlineCode> is.
        </span>
        <span className="mt-2 block">
          Because <InlineCode>await</InlineCode> reads like a blocking call, it is easy to write steps in
          sequence that never needed to be. Two independent requests awaited on consecutive lines take as long
          as both put together, while starting both first and awaiting once takes as long as the slower one. The
          experiment below measures exactly that difference.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "In what order do the logs appear?",
    code: [
      "async function f() {",
      '  console.log("1");',
      "  await null;",
      '  console.log("3");',
      "}",
      "",
      "f();",
      'console.log("2");',
    ],
    options: [
      { id: "correct", label: "1, 2, 3" },
      {
        id: "sync",
        label: "1, 3, 2",
        feedback:
          "The resumption after `await` is never synchronous. Even awaiting `null` queues the rest of the function as a microtask, and every synchronous line runs first.",
      },
      {
        id: "deferred",
        label: "2, 1, 3",
        feedback:
          "Calling an async function does not defer it. The body starts running immediately, so `1` logs before the call even returns.",
      },
      {
        id: "never",
        label: "1, 2 — the function never resumes",
        feedback:
          "`await null` wraps the value in an already-resolved promise, so the continuation is queued and runs as soon as the stack is empty.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`f()` runs immediately and logs `1`, then `await` parks it and hands the stack back — so `2` logs next. Once there is no synchronous code left, the queued continuation resumes and logs `3`.",
  },

  challenge: {
    question: "What does `load()` evaluate to here?",
    code: ["async function load() {", "  return 42;", "}", "", "const result = load();"],
    options: [
      { id: "correct", label: "A promise that fulfils with 42" },
      {
        id: "value",
        label: "42",
        feedback:
          "An async function always wraps its return value in a promise. Reading `result` synchronously gives you the promise, not the number.",
      },
      {
        id: "undefined",
        label: "undefined",
        feedback:
          "The `return` is not lost — it settles the promise the function handed back. It is just not readable without `await` or `.then`.",
      },
      {
        id: "nested",
        label: "A promise that fulfils with another promise",
        feedback:
          "Promises never fulfil with a promise: a returned promise is adopted rather than wrapped, so you only ever have to unwrap once.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "`async` is a promise-returning wrapper on the function. `return 42` fulfils that promise with 42, and a `throw` would reject it — which is why the only way to read the result is `await load()` or `load().then(...)`.",
  },

  remember:
    "`await` pauses one function, never the thread: the function is lifted off the call stack and its continuation is queued as a microtask when the promise settles. That is what lets asynchronous steps be written as ordinary statements, with results in named variables and failures caught by a normal `try`/`catch` — and an `async` function always hands back a promise.",
};
