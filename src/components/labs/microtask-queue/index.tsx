import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { MicrotaskControls } from "./MicrotaskControls";
import { MicrotaskExperiment } from "./MicrotaskExperiment";
import { MicrotaskVisualization } from "./MicrotaskVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { MicrotaskInputs, MicrotaskStepState } from "./types";

export const microtaskQueueLab: LabDefinition<MicrotaskInputs, MicrotaskStepState> = {
  slug: "microtask-queue",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "rule" },
  getCode,
  buildInitialSteps,
  simulationControls: MicrotaskControls,
  Visualization: MicrotaskVisualization,
  experimentPanel: MicrotaskExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does .then beat an earlier setTimeout?",
    bullets: [
      <>
        There are two queues, not one. <InlineCode>setTimeout</InlineCode> callbacks go to the task queue;
        promise handlers and <InlineCode>queueMicrotask</InlineCode> go to the microtask queue.
      </>,
      <>When the stack empties, the loop checks the microtask queue first &mdash; always.</>,
      <>
        It drains that queue <em>completely</em>, including microtasks added while it is draining.
      </>,
      <>Only once the microtask queue is empty does it take a single task from the task queue.</>,
      <>
        So the order a callback was scheduled in does not decide when it runs. The queue it landed in does.
      </>,
    ],
    comparisonItems: [
      {
        label: "setTimeout(fn, 0)",
        columns: [
          { header: "Goes to", value: "Task queue" },
          { header: "Runs", value: "After every microtask — one task per loop turn" },
        ],
      },
      {
        label: ".then / .catch / .finally",
        columns: [
          { header: "Goes to", value: "Microtask queue" },
          { header: "Runs", value: "Before the next task, in the same drain" },
        ],
      },
      {
        label: "queueMicrotask(fn)",
        columns: [
          { header: "Goes to", value: "Microtask queue" },
          { header: "Runs", value: "Same as a promise handler" },
        ],
      },
    ],
    columnsHeader: "Scheduled with",
    technicalNote: (
      <>
        <span className="block">
          The task queue is also called the <em>macrotask</em> queue &mdash; the Event Loop lesson&apos;s
          &ldquo;task queue&rdquo; and that name mean the same thing. The drain is exhaustive and re-entrant: the
          queue has to <em>be</em> empty, not merely have been empty when the pass started, so a microtask that
          queues another microtask extends the same pass. Rendering gets its chance between tasks, not between
          microtasks, which is why a long chain of handlers can delay a repaint.
        </span>
        <span className="mt-2 block">
          That exhaustiveness has one real hazard. A microtask that queues another microtask forever never lets
          the loop reach the task queue at all: timers never fire, clicks are never handled, the page never
          repaints, and nothing throws an error to tell you why. Starving the task queue this way is the one way
          the priority rule can bite. <InlineCode>await</InlineCode> is built on this same queue &mdash; that is
          the next lesson.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "In what order do the logs appear?",
    code: [
      'console.log("A");',
      "",
      'setTimeout(() => console.log("B"), 0);',
      "",
      "Promise.resolve()",
      '  .then(() => console.log("C"))',
      '  .then(() => console.log("D"));',
      "",
      'console.log("E");',
    ],
    options: [
      { id: "correct", label: "A, E, C, D, B" },
      {
        id: "timer-early",
        label: "A, E, B, C, D",
        feedback:
          "`B` is in the task queue, so it cannot run until the microtask queue is empty — and `C` and `D` are both in there.",
      },
      {
        id: "chain-early",
        label: "A, C, D, E, B",
        feedback:
          "`C` and `D` are queued, not run on the spot. Every synchronous line, including `E`, finishes before any handler does.",
      },
      {
        id: "split",
        label: "A, E, C, B, D",
        feedback:
          "The drain does not stop halfway. `D` is queued by `C` while the drain is still running, so it joins the same pass and runs before `B`.",
      },
    ],
    correctOptionId: "correct",
    explanation:
      "The synchronous lines go first, so `A` and `E`. Then the loop drains the whole microtask queue — `C`, and then `D`, which `C` queued during the drain. Only then does it take the one waiting task, `B`.",
  },

  challenge: {
    question: "A `.then` callback queues another `.then` while the microtask queue is being drained. When does the new one run?",
    options: [
      { id: "same-drain", label: "In the same drain, before any task runs" },
      {
        id: "next-turn",
        label: "On the next turn, after one task has run",
        feedback:
          "The loop re-checks the queue after each microtask rather than working from a snapshot, so the new one is picked up immediately.",
      },
      {
        id: "task-queue",
        label: "It goes to the task queue, because the drain already started",
        feedback:
          "What decides the queue is how the callback was scheduled, not when. A promise handler is always a microtask.",
      },
      {
        id: "sync",
        label: "Immediately and synchronously, inside the current handler",
        feedback:
          "Handlers are always queued, never called inline — even when the promise is already resolved. It runs after the current handler returns.",
      },
    ],
    correctOptionId: "same-drain",
    explanation:
      "The loop keeps taking microtasks until the queue is actually empty, so anything added during the drain extends it. That is what makes a long `.then` chain complete before a `setTimeout(fn, 0)` that was ready before the chain even started.",
  },

  remember:
    "Promise handlers go to the microtask queue, `setTimeout` callbacks to the task queue. When the stack empties the loop drains the entire microtask queue — including microtasks added during the drain — before taking a single task. That is why a `.then` runs before a `setTimeout(fn, 0)` scheduled earlier.",
};
