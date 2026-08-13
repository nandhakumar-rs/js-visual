import type { ExecutionStep } from "@/lib/execution/types";
import type { EventLoopStepState, EventLoopInputs, WebApiTask } from "./types";

const MAIN = { id: "main", label: "main()", isActive: true };
const RUNNING = { text: "RUNNING", tone: "new" as const };

function timer(id: string, ms: number, remainingMs: number): WebApiTask {
  return { id, label: `setTimeout ${ms}ms`, durationMs: ms, remainingMs };
}

function zeroTimeoutSteps(): ExecutionStep<EventLoopStepState>[] {
  const cb = { id: "cb", label: '() => console.log("B")' };

  return [
    {
      id: "sync-a",
      title: "main() runs and logs A",
      description:
        "The script starts on the call stack. There is one stack, and whatever sits on it is the only thing running.",
      whyExplanation:
        "JavaScript is single-threaded: one stack, one thing at a time. Everything else in this lesson is about what happens to work that cannot run right now.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "z-a", kind: "output", content: "A" }],
      state: {
        phase: "running-sync",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [],
        taskQueue: [],
        stackEmpty: false,
      },
    },
    {
      id: "hand-off",
      title: "setTimeout hands the callback to the browser",
      description:
        "The callback does not go on the stack, and setTimeout does not wait. It registers the callback with a Web API and returns immediately.",
      whyExplanation:
        "This is where your function waits. The browser does the timing outside the stack, which is why the rest of your code carries straight on.",
      activeCodeLines: [3, 4, 5],
      state: {
        phase: "waiting",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [timer("t0", 0, 0)],
        taskQueue: [],
        stackEmpty: false,
        note: "setTimeout returned instantly. main() never paused.",
      },
    },
    {
      id: "sync-c",
      title: "C logs while the callback is already ready",
      description:
        "The 0ms wait is over, so the callback has moved into the task queue. It is ready to run — and it still cannot, because main() is on the stack.",
      whyExplanation:
        "A finished Web API task does not jump back onto the stack. It joins the queue and waits its turn.",
      activeCodeLines: [7],
      consoleOutput: [{ id: "z-c", kind: "output", content: "C" }],
      state: {
        phase: "queued",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [],
        taskQueue: [cb],
        stackEmpty: false,
        note: "Ready since almost 0ms ago — but the stack is busy.",
      },
    },
    {
      id: "stack-empties",
      title: "main() returns and the stack empties",
      description: "The last line of the script has run, so the stack is finally empty.",
      whyExplanation: "This is the moment the loop has been waiting for. An empty stack is its only cue.",
      activeCodeLines: [7],
      state: {
        phase: "loop-moves",
        callStack: [],
        webApis: [],
        taskQueue: [cb],
        stackEmpty: true,
      },
    },
    {
      id: "loop-moves",
      title: "The event loop moves the callback across",
      description:
        "With the stack empty, the loop takes the first task out of the queue and pushes it onto the stack.",
      whyExplanation:
        "That check — is the stack empty, and is anything queued — is the whole job of the event loop. Nothing else decides when your callback runs.",
      activeCodeLines: [3, 4],
      state: {
        phase: "callback-runs",
        callStack: [{ id: "cb", label: 'callback()', isActive: true, statusBadge: RUNNING }],
        webApis: [],
        taskQueue: [],
        stackEmpty: false,
        movingId: "cb",
      },
    },
    {
      id: "logs-b",
      title: "B logs, last",
      description:
        "B was scheduled on line 3, before C was even reached — and it still printed last, because it had to go all the way round.",
      whyExplanation:
        "Stack, then Web API, then queue, then back to the stack. That round trip is why a `0`ms timer never runs immediately.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "z-b", kind: "output", content: "B" }],
      state: {
        phase: "done",
        callStack: [],
        webApis: [],
        taskQueue: [],
        stackEmpty: true,
        note: "Written second, ran last. A → C → B.",
      },
    },
  ];
}

function twoTimersSteps(): ExecutionStep<EventLoopStepState>[] {
  const first = { id: "first", label: '() => console.log("first")' };
  const second = { id: "second", label: '() => console.log("second")' };

  return [
    {
      id: "both-handed",
      title: "Both callbacks go to the browser",
      description:
        "Two setTimeout calls run one after the other. Neither waits — both callbacks are registered and both lines return immediately.",
      activeCodeLines: [1, 2],
      state: {
        phase: "waiting",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [timer("t100", 100, 100), timer("t0", 0, 0)],
        taskQueue: [],
        stackEmpty: false,
      },
    },
    {
      id: "sync",
      title: "sync logs first",
      description: "Line 4 runs while both timers are still with the browser. Nothing queued can run yet.",
      whyExplanation:
        "Synchronous code always finishes before any queued task, because a queued task needs the stack to be empty.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "t-sync", kind: "output", content: "sync" }],
      state: {
        phase: "running-sync",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [timer("t100", 100, 100), timer("t0", 0, 0)],
        taskQueue: [],
        stackEmpty: false,
      },
    },
    {
      id: "zero-finishes",
      title: "The 0ms timer finishes and joins the queue",
      description:
        "It was the second setTimeout written, but the first to finish waiting — so it is first into the queue.",
      whyExplanation:
        "The queue is filled in the order timers finish, not the order they were created. The delay decides the position.",
      activeCodeLines: [2],
      state: {
        phase: "queued",
        callStack: [],
        webApis: [timer("t100", 100, 100)],
        taskQueue: [first],
        stackEmpty: true,
      },
    },
    {
      id: "first-runs",
      title: "The loop takes it — first logs",
      description: "The stack is empty, so the loop moves the queued callback across and it runs.",
      activeCodeLines: [2],
      consoleOutput: [{ id: "t-first", kind: "output", content: "first" }],
      state: {
        phase: "callback-runs",
        callStack: [{ id: "first", label: "callback()", isActive: true, statusBadge: RUNNING }],
        webApis: [timer("t100", 100, 40)],
        taskQueue: [],
        stackEmpty: false,
        movingId: "first",
      },
    },
    {
      id: "hundred-finishes",
      title: "The 100ms timer finishes later",
      description: "Its wait ends well after the other one, so it joins an empty queue.",
      activeCodeLines: [1],
      state: {
        phase: "queued",
        callStack: [],
        webApis: [],
        taskQueue: [second],
        stackEmpty: true,
      },
    },
    {
      id: "second-runs",
      title: "second logs, last",
      description:
        "It was written on line 1 and it printed last. The order on the page had nothing to do with it.",
      whyExplanation:
        "Two things decided the order: synchronous code goes first, and among queued tasks the one that finished waiting first goes first.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "t-second", kind: "output", content: "second" }],
      state: {
        phase: "done",
        callStack: [],
        webApis: [],
        taskQueue: [],
        stackEmpty: true,
        note: "Written 1st, ran last. Swapping the two lines changes nothing.",
      },
    },
  ];
}

function busyStackSteps(): ExecutionStep<EventLoopStepState>[] {
  const cb = { id: "cb", label: '() => console.log("timer done")' };
  const blocking = {
    id: "main",
    label: "main()",
    isActive: true,
    statusBadge: { text: "BLOCKING — 800ms", tone: "changed" as const },
  };

  return [
    {
      id: "hand-off",
      title: "The callback goes to the browser, asking for 0ms",
      description: "A 0ms timer: about as urgent as it is possible to ask for.",
      activeCodeLines: [1, 2, 3],
      state: {
        phase: "waiting",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [timer("t0", 0, 0)],
        taskQueue: [],
        stackEmpty: false,
      },
    },
    {
      id: "ready-immediately",
      title: "It is queue-ready almost instantly",
      description: "The wait is already over, and the callback is sitting in the task queue, ready to go.",
      activeCodeLines: [3],
      state: {
        phase: "queued",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [],
        taskQueue: [cb],
        stackEmpty: false,
      },
    },
    {
      id: "blocking",
      title: "Then the while loop takes over the stack",
      description:
        "Line 6 spins for 800ms doing nothing useful. It is ordinary synchronous code, so it holds the stack the entire time.",
      whyExplanation:
        "Once a task starts running it runs to completion. Nothing interrupts it — not a timer, not a click, not the loop.",
      activeCodeLines: [5, 6],
      state: {
        phase: "running-sync",
        callStack: [blocking],
        webApis: [],
        taskQueue: [cb],
        stackEmpty: false,
        note: "The callback has been ready for 800ms and counting.",
      },
    },
    {
      id: "loop-blocked",
      title: "The loop checks, and cannot do anything",
      description:
        "There is a task queued and the loop knows it. But the stack is not empty, so it may not move anything across.",
      whyExplanation:
        "This is the answer to when a `setTimeout` callback actually runs: not when its timer ends, but at the first moment the stack is empty afterwards.",
      activeCodeLines: [6],
      state: {
        phase: "loop-blocked",
        callStack: [blocking],
        webApis: [],
        taskQueue: [cb],
        stackEmpty: false,
        note: "Ready task + busy stack = the task waits. Every time.",
      },
    },
    {
      id: "unblocks",
      title: "The loop ends and blocking finished logs",
      description: "800ms later the while loop finally exits, line 8 runs, and main() returns.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "b-done", kind: "output", content: "blocking finished" }],
      state: {
        phase: "loop-moves",
        callStack: [],
        webApis: [],
        taskQueue: [cb],
        stackEmpty: true,
      },
    },
    {
      id: "finally-runs",
      title: "Only now does the 0ms callback run",
      description:
        "The stack is empty, so the loop moves it across at last — roughly 800ms after a delay of 0 was requested.",
      whyExplanation:
        "The delay is a minimum, not a schedule. `0` means as soon as the stack is free, and how long that takes is up to your own code.",
      activeCodeLines: [2],
      consoleOutput: [{ id: "b-timer", kind: "output", content: "timer done" }],
      state: {
        phase: "done",
        callStack: [],
        webApis: [],
        taskQueue: [],
        stackEmpty: true,
        movingId: "cb",
        note: "Asked for 0ms. Waited ~800ms. Try it yourself below.",
      },
    },
  ];
}

function allTogetherSteps(): ExecutionStep<EventLoopStepState>[] {
  const t1 = { id: "t1", label: "timer 1 callback" };
  const t2 = { id: "t2", label: "timer 2 callback" };
  const t3 = { id: "t3", label: "timer 3 callback" };

  return [
    {
      id: "sync",
      title: "start logs, and both timers are registered",
      description:
        "Line 1 logs immediately. Lines 3 and 8 hand two callbacks to the browser, and neither one waits.",
      activeCodeLines: [1, 3, 8],
      consoleOutput: [{ id: "at-start", kind: "output", content: "start" }],
      state: {
        phase: "running-sync",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [timer("t1", 0, 0), timer("t2", 0, 0)],
        taskQueue: [],
        stackEmpty: false,
      },
    },
    {
      id: "queued",
      title: "end logs while both callbacks queue up",
      description:
        "Both 0ms waits are already over, so both callbacks are sitting in the task queue. Line 10 still runs first.",
      whyExplanation:
        "Neither can run while `main()` is on the stack, however long ago their timers finished.",
      activeCodeLines: [10],
      consoleOutput: [{ id: "at-end", kind: "output", content: "end" }],
      state: {
        phase: "queued",
        callStack: [{ ...MAIN, statusBadge: RUNNING }],
        webApis: [],
        taskQueue: [t1, t2],
        stackEmpty: false,
      },
    },
    {
      id: "t1-runs",
      title: "The loop takes the first task",
      description: "The stack is empty, so timer 1's callback runs and logs.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "at-t1", kind: "output", content: "timer 1" }],
      state: {
        phase: "callback-runs",
        callStack: [],
        webApis: [],
        taskQueue: [t2],
        stackEmpty: false,
      },
    },
    {
      id: "t3-registered",
      title: "It registers a third timer while it is running",
      description:
        "Line 5 runs inside a task. Its callback goes to the back of the queue, behind timer 2, which has been waiting since before this task started.",
      whyExplanation:
        "The queue is first in, first out. Being scheduled by the code that is running right now buys no priority at all.",
      activeCodeLines: [5],
      state: {
        phase: "queued",
        callStack: [],
        webApis: [],
        taskQueue: [t2, t3],
        stackEmpty: true,
        note: "timer 3 joined behind timer 2, not in front of it.",
      },
    },
    {
      id: "t2-runs",
      title: "timer 2 runs next, not timer 3",
      description: "The loop takes the front of the queue, which is still timer 2.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "at-t2", kind: "output", content: "timer 2" }],
      state: {
        phase: "callback-runs",
        callStack: [],
        webApis: [],
        taskQueue: [t3],
        stackEmpty: false,
      },
    },
    {
      id: "t3-runs",
      title: "And timer 3 last",
      description:
        "Registered during timer 1's task, but it still had to wait its turn behind everything already queued.",
      whyExplanation:
        "A callback scheduled from inside a running task joins the back of the queue. In the next lesson you will see a kind of callback that does not — it jumps in front of everything waiting here.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "at-t3", kind: "output", content: "timer 3" }],
      state: {
        phase: "done",
        callStack: [],
        webApis: [],
        taskQueue: [],
        stackEmpty: true,
        note: "start → end → timer 1 → timer 2 → timer 3",
      },
    },
  ];
}

export function buildInitialSteps({ scenario }: EventLoopInputs): ExecutionStep<EventLoopStepState>[] {
  if (scenario === "zero-timeout") return zeroTimeoutSteps();
  if (scenario === "two-timers") return twoTimersSteps();
  if (scenario === "busy-stack") return busyStackSteps();
  return allTogetherSteps();
}
