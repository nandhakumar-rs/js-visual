import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { EventLoopControls } from "./EventLoopControls";
import { EventLoopExperiment } from "./EventLoopExperiment";
import { EventLoopVisualization } from "./EventLoopVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { EventLoopInputs, EventLoopStepState } from "./types";

export const eventLoopLab: LabDefinition<EventLoopInputs, EventLoopStepState> = {
  slug: "event-loop",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "zero-timeout" },
  getCode,
  buildInitialSteps,
  simulationControls: EventLoopControls,
  Visualization: EventLoopVisualization,
  experimentPanel: EventLoopExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does setTimeout(fn, 0) still run last?",
    bullets: [
      <>
        JavaScript runs on one thread with one call stack, so only one thing runs at a time and nothing
        interrupts it.
      </>,
      <>
        <InlineCode>setTimeout</InlineCode> does not wait. It registers the callback with the browser and returns
        immediately, which is why the rest of your code keeps going.
      </>,
      <>
        The browser does the timing off the stack &mdash; and when the time is up it does not run your callback,
        it puts it in the task queue.
      </>,
      <>
        The event loop moves a queued task onto the stack only when the stack is <em>empty</em>.
      </>,
      <>
        So the delay is a minimum, not a schedule. <InlineCode>0</InlineCode> means &ldquo;as soon as the stack is
        free&rdquo;, which can be a great deal later.
      </>,
    ],
    comparisonItems: [
      {
        label: "On the call stack",
        columns: [
          { header: "What it means", value: "Running right now" },
          { header: "Can your code run meanwhile?", value: "No — this is your code running" },
        ],
      },
      {
        label: "In a Web API",
        columns: [
          { header: "What it means", value: "The browser is doing the waiting, off the thread" },
          { header: "Can your code run meanwhile?", value: "Yes — the stack is free" },
        ],
      },
      {
        label: "In the task queue",
        columns: [
          { header: "What it means", value: "Finished waiting, ready to run" },
          { header: "Can your code run meanwhile?", value: "Yes — and that is the problem: it must wait for the stack" },
        ],
      },
    ],
    columnsHeader: "Where the callback is",
    technicalNote: (
      <>
        <span className="block">
          Tasks run to completion: once one starts on the stack it finishes before anything else is picked up,
          and nothing preempts it. That is what makes the model predictable, and also why a single long function
          stalls everything at once &mdash; timers, clicks and rendering all wait behind it. The task queue is not
          just for timers: finished network requests and user events arrive there the same way.
        </span>
        <span className="mt-2 block">
          The delay argument is a floor rather than a schedule. Browsers clamp nested timers to a minimum of
          about 4ms once they are a few levels deep, and throttle them harder in background tabs, so{" "}
          <InlineCode>0</InlineCode> is never really 0. Promise handlers do not use this queue at all &mdash;
          they go to a second one with higher priority, which is why a <InlineCode>.then</InlineCode> can run
          before a <InlineCode>setTimeout(fn, 0)</InlineCode> scheduled earlier. That queue is the Microtask
          Queue lesson.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "In what order do the logs appear?",
    code: [
      'console.log("1");',
      "",
      'setTimeout(() => console.log("2"), 0);',
      "",
      "for (let i = 0; i < 3; i++) {",
      '  console.log("3");',
      "}",
      "",
      'console.log("4");',
    ],
    options: [
      { id: "sync-first", label: "1, 3, 3, 3, 4, 2" },
      {
        id: "timer-second",
        label: "1, 2, 3, 3, 3, 4",
        feedback:
          "`setTimeout` schedules the callback rather than running it. The stack still holds the rest of the script, so the callback cannot run yet.",
      },
      {
        id: "timer-mid",
        label: "1, 3, 3, 3, 2, 4",
        feedback:
          "Nothing interrupts running code between iterations. The loop, and then line 9, run to completion before the queue is touched.",
      },
      {
        id: "timer-first",
        label: "2, 1, 3, 3, 3, 4",
        feedback:
          "A `0`ms delay is the shortest wait you can ask for, not a way to jump the queue. It still has to go through the browser and the task queue.",
      },
    ],
    correctOptionId: "sync-first",
    explanation:
      "Every synchronous line runs first, because the queued callback cannot start until the stack is empty. Only once line 9 has run and the script finishes does the event loop move the callback across.",
  },

  challenge: {
    question:
      "A `setTimeout(fn, 100)` finishes its wait while a function that takes 500ms is still running. When does `fn` run?",
    options: [
      { id: "after", label: "After the 500ms function finishes and the stack empties" },
      {
        id: "interrupt",
        label: "At 100ms, interrupting the running function",
        feedback:
          "Nothing preempts a running task. JavaScript has one stack and each task runs to completion before the next is picked up.",
      },
      {
        id: "thread",
        label: "At 100ms, on a separate thread",
        feedback:
          "The browser's timer does run elsewhere, but `fn` is your code — and your code has only one stack to run on.",
      },
      {
        id: "cancelled",
        label: "It is cancelled, because the stack was busy when the timer finished",
        feedback:
          "Nothing is dropped. The callback waits in the task queue for as long as it takes, then runs.",
      },
    ],
    correctOptionId: "after",
    explanation:
      "The timer finishing only moves the callback into the task queue. The event loop then waits for the stack to be empty, which does not happen until the 500ms function returns — so `fn` runs roughly 500ms in, not 100ms.",
  },

  remember:
    "JavaScript has one call stack. `setTimeout` hands your callback to the browser, which does the waiting and then puts it in the task queue. The event loop only moves it onto the stack once the stack is empty — so the delay you ask for is a minimum, not a guarantee.",
};
