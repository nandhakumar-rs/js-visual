import type { ExecutionStep } from "@/lib/execution/types";
import type { MicrotaskInputs, MicrotaskStepState } from "./types";

const MAIN = { id: "main", label: "main()", isActive: true, statusBadge: { text: "RUNNING", tone: "new" as const } };

function frame(label: string) {
  return [{ id: "cb", label, isActive: true, statusBadge: { text: "RUNNING", tone: "new" as const } }];
}

function ruleSteps(): ExecutionStep<MicrotaskStepState>[] {
  const timeout = { id: "timeout", label: '() => console.log("timeout")' };
  const then = { id: "then", label: '() => console.log("then")' };

  return [
    {
      id: "timer-registered",
      title: "The timer is scheduled first",
      description:
        "Line 1 runs before anything else. Its callback goes to the task queue, the same one the Event Loop lesson used.",
      whyExplanation:
        "Scheduled first, and it will still finish last. Which queue a callback lands in matters more than when it was scheduled.",
      activeCodeLines: [1],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "then-registered",
      title: "The promise handler goes somewhere else",
      description:
        "The promise is already resolved, so its handler is ready immediately — but it joins the microtask queue, not the task queue.",
      whyExplanation:
        "This is the second queue. Promise handlers never use the task queue, which is what makes their timing different.",
      activeCodeLines: [3],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [then],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: false,
        note: "Two callbacks, two different queues.",
      },
    },
    {
      id: "sync-logs",
      title: "sync logs while both wait",
      description: "Neither queued callback can run yet. Synchronous code always finishes first.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "r-sync", kind: "output", content: "sync" }],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [then],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "stack-empties",
      title: "The stack empties — and the loop checks microtasks first",
      description:
        "main() returns. The loop now has a choice of two queues, and it always looks at the microtask queue before the task queue.",
      whyExplanation:
        "This priority is the whole lesson. The task queue is not consulted at all while anything is waiting in the microtask queue.",
      activeCodeLines: [5],
      state: {
        phase: "stack-empties",
        callStack: [],
        microtasks: [then],
        taskQueue: [timeout],
        stackEmpty: true,
        drainingMicrotasks: true,
      },
    },
    {
      id: "then-runs",
      title: "then logs",
      description: "The microtask runs, even though its line was written after the setTimeout call.",
      activeCodeLines: [3],
      consoleOutput: [{ id: "r-then", kind: "output", content: "then" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("then handler"),
        microtasks: [],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: true,
      },
    },
    {
      id: "timeout-runs",
      title: "Only now does the timer callback run",
      description:
        "With the microtask queue empty, the loop finally takes the one waiting task. It was scheduled first and ran last.",
      whyExplanation:
        "That is the answer to the question: a `.then` beats an earlier `setTimeout(fn, 0)` because it is in a queue with higher priority, not because it was faster.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "r-timeout", kind: "output", content: "timeout" }],
      state: {
        phase: "task-runs",
        callStack: frame("timeout callback"),
        microtasks: [],
        taskQueue: [],
        stackEmpty: false,
        drainingMicrotasks: false,
        note: "Scheduled on line 1. Ran last.",
      },
    },
  ];
}

function drainSteps(): ExecutionStep<MicrotaskStepState>[] {
  const timeout = { id: "timeout", label: '() => console.log("timeout")' };
  const m = (n: number) => ({ id: `m${n}`, label: `() => console.log("m${n}")` });

  return [
    {
      id: "setup",
      title: "One task, and a chain of three handlers",
      description:
        "The timer goes to the task queue. Only the first link of the chain is queued so far — the others do not exist yet.",
      whyExplanation:
        "A `.then` handler is only queued once the promise before it settles, so the chain queues itself one link at a time.",
      activeCodeLines: [1, 3, 4],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [m(1)],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "sync-logs",
      title: "sync logs",
      description: "Synchronous code first, as always.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "d-sync", kind: "output", content: "sync" }],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [m(1)],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "m1",
      title: "m1 runs — and queues m2 as it finishes",
      description:
        "The drain begins. Running the first handler settles its promise, which immediately queues the second one.",
      whyExplanation:
        "The queue is not a fixed list. Anything added while the drain is running joins the same drain.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "d-m1", kind: "output", content: "m1" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("m1 handler"),
        microtasks: [m(2)],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: true,
      },
    },
    {
      id: "m2",
      title: "m2 runs — and queues m3",
      description: "Same again. The task queue has not been touched.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "d-m2", kind: "output", content: "m2" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("m2 handler"),
        microtasks: [m(3)],
        taskQueue: [timeout],
        stackEmpty: false,
        drainingMicrotasks: true,
        note: "The timer has been ready this whole time.",
      },
    },
    {
      id: "m3",
      title: "m3 runs and the queue is finally empty",
      description: "Three handlers, back to back, in one drain.",
      whyExplanation:
        "If the loop took one microtask per turn, the timer would have run somewhere in the middle. It does not — it empties the queue.",
      activeCodeLines: [6],
      consoleOutput: [{ id: "d-m3", kind: "output", content: "m3" }],
      state: {
        phase: "draining",
        callStack: [],
        microtasks: [],
        taskQueue: [timeout],
        stackEmpty: true,
        drainingMicrotasks: true,
      },
    },
    {
      id: "timeout-runs",
      title: "And now the task",
      description: "Only with the microtask queue completely empty does the loop take the waiting task.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "d-timeout", kind: "output", content: "timeout" }],
      state: {
        phase: "task-runs",
        callStack: frame("timeout callback"),
        microtasks: [],
        taskQueue: [],
        stackEmpty: false,
        drainingMicrotasks: false,
        note: "Three microtasks, then one task. Never interleaved.",
      },
    },
  ];
}

function betweenSteps(): ExecutionStep<MicrotaskStepState>[] {
  const t1 = { id: "t1", label: "first timeout callback" };
  const t2 = { id: "t2", label: "second timeout callback" };
  const m1 = { id: "m1", label: '() => console.log("m1")' };
  const m2 = { id: "m2", label: '() => console.log("m2")' };

  return [
    {
      id: "setup",
      title: "Two tasks queued, no microtasks yet",
      description:
        "Both timers finish their 0ms wait during the synchronous run, so both callbacks are queued. The microtask queue is empty.",
      activeCodeLines: [1, 6],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [],
        taskQueue: [t1, t2],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "t1-runs",
      title: "The loop takes the first task",
      description: "t1 logs, and while it runs it queues a microtask of its own.",
      activeCodeLines: [2, 3],
      consoleOutput: [{ id: "b-t1", kind: "output", content: "t1" }],
      state: {
        phase: "task-runs",
        callStack: frame("t1 callback"),
        microtasks: [m1],
        taskQueue: [t2],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "drain-after-t1",
      title: "Before the second task, the drain runs again",
      description:
        "t1 returns and the stack empties. There is a task waiting — but the microtask queue is checked first, and it is not empty.",
      whyExplanation:
        "This is the beat most people miss. The drain is not a one-off before the first task; it happens after every single task.",
      activeCodeLines: [3],
      state: {
        phase: "stack-empties",
        callStack: [],
        microtasks: [m1],
        taskQueue: [t2],
        stackEmpty: true,
        drainingMicrotasks: true,
        note: "t2 is queued and ready — and still has to wait.",
      },
    },
    {
      id: "m1-runs",
      title: "m1 runs, ahead of the task that was already waiting",
      description: "The microtask jumps in front of t2, which has been queued since before m1 even existed.",
      activeCodeLines: [3],
      consoleOutput: [{ id: "b-m1", kind: "output", content: "m1" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("m1 handler"),
        microtasks: [],
        taskQueue: [t2],
        stackEmpty: false,
        drainingMicrotasks: true,
      },
    },
    {
      id: "t2-runs",
      title: "Now the second task",
      description: "With microtasks empty again, the loop takes t2 — which queues its own microtask in turn.",
      activeCodeLines: [7, 8],
      consoleOutput: [{ id: "b-t2", kind: "output", content: "t2" }],
      state: {
        phase: "task-runs",
        callStack: frame("t2 callback"),
        microtasks: [m2],
        taskQueue: [],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "m2-runs",
      title: "And the drain runs once more",
      description:
        "The final order is t1, m1, t2, m2 — the two tasks never run back to back, because a drain happens between them.",
      whyExplanation:
        "One task, then the whole microtask queue. Repeat. That is the loop's actual cycle, and it explains every ordering puzzle of this shape.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "b-m2", kind: "output", content: "m2" }],
      state: {
        phase: "done",
        callStack: [],
        microtasks: [],
        taskQueue: [],
        stackEmpty: true,
        drainingMicrotasks: false,
        note: "t1 → m1 → t2 → m2. Not t1 → t2 → m1 → m2.",
      },
    },
  ];
}

function allTogetherSteps(): ExecutionStep<MicrotaskStepState>[] {
  const timerA = { id: "ta", label: "timer callback" };
  const timerB = { id: "tb", label: "timer inside promise" };
  const p1 = { id: "p1", label: '() => console.log("promise 1")' };
  const p2 = { id: "p2", label: '() => console.log("promise 2")' };
  const pit = { id: "pit", label: '() => console.log("promise inside timer")' };

  return [
    {
      id: "sync",
      title: "The synchronous run: start, then end",
      description:
        "Line 1 and line 14 both run now. In between, the setTimeout on line 3 puts its callback in the task queue and the promise handler on line 8 goes to the microtask queue.",
      whyExplanation:
        "Two callbacks scheduled, two different queues. Nothing else has happened yet — this is still one uninterrupted run of the script.",
      activeCodeLines: [1, 14],
      consoleOutput: [
        { id: "at-start", kind: "output", content: "start" },
        { id: "at-end", kind: "output", content: "end" },
      ],
      state: {
        phase: "sync",
        callStack: [MAIN],
        microtasks: [p1],
        taskQueue: [timerA],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "drain-begins",
      title: "The stack empties — microtasks go first",
      description:
        "There is a task waiting and a microtask waiting. The loop takes the microtask, every time.",
      activeCodeLines: [8],
      state: {
        phase: "stack-empties",
        callStack: [],
        microtasks: [p1],
        taskQueue: [timerA],
        stackEmpty: true,
        drainingMicrotasks: true,
      },
    },
    {
      id: "promise-1",
      title: "promise 1 runs, and schedules two more things",
      description:
        "While it runs, line 10 registers a second timer and line 11 queues another microtask. They go to different queues, and only one of them will run soon.",
      whyExplanation:
        "The new timer joins the back of the task queue, behind the timer from line 3. The new microtask joins the drain that is already in progress.",
      activeCodeLines: [9, 10, 11],
      consoleOutput: [{ id: "at-p1", kind: "output", content: "promise 1" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("promise 1 handler"),
        microtasks: [p2],
        taskQueue: [timerA, timerB],
        stackEmpty: false,
        drainingMicrotasks: true,
      },
    },
    {
      id: "promise-2",
      title: "promise 2 runs in the same drain",
      description:
        "It was queued a moment ago, during the drain — so it extends the drain rather than waiting for the next turn.",
      whyExplanation:
        "This is the re-entrant part of the rule. Both timers have been queued this whole time and neither has run.",
      activeCodeLines: [11],
      consoleOutput: [{ id: "at-p2", kind: "output", content: "promise 2" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("promise 2 handler"),
        microtasks: [],
        taskQueue: [timerA, timerB],
        stackEmpty: false,
        drainingMicrotasks: true,
      },
    },
    {
      id: "timer-runs",
      title: "Microtasks empty at last — take one task",
      description:
        "The loop takes the front of the task queue: the timer from line 3. It logs, and queues a microtask of its own on line 5.",
      whyExplanation: "One task. Not both — the loop takes exactly one, then looks at the microtasks again.",
      activeCodeLines: [4, 5],
      consoleOutput: [{ id: "at-timer", kind: "output", content: "timer" }],
      state: {
        phase: "task-runs",
        callStack: frame("timer callback"),
        microtasks: [pit],
        taskQueue: [timerB],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "promise-inside-timer",
      title: "And the drain runs again, before the second timer",
      description:
        "promise inside timer was queued a moment ago. The second timer has been waiting far longer — and still goes after it.",
      whyExplanation:
        "After every task, the microtask queue is drained again. Age in the queue counts for nothing against priority.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "at-pit", kind: "output", content: "promise inside timer" }],
      state: {
        phase: "microtask-runs",
        callStack: frame("promise inside timer"),
        microtasks: [],
        taskQueue: [timerB],
        stackEmpty: false,
        drainingMicrotasks: true,
      },
    },
    {
      id: "timer-inside-promise",
      title: "Finally the second timer",
      description:
        "Registered back on line 10, during the very first microtask — and it runs dead last, after four other callbacks.",
      activeCodeLines: [10],
      consoleOutput: [{ id: "at-tip", kind: "output", content: "timer inside promise" }],
      state: {
        phase: "task-runs",
        callStack: frame("timer inside promise"),
        microtasks: [],
        taskQueue: [],
        stackEmpty: false,
        drainingMicrotasks: false,
      },
    },
    {
      id: "full-order",
      title: "The whole order",
      description:
        "Two synchronous logs, then every microtask, then one task, then every microtask again, then the last task.",
      whyExplanation:
        "Compare this with the Event Loop lesson's last scenario. There, a timer registered mid-task joined the back of the queue. Here a promise handler registered at the same moment jumped in front of a timer that was already waiting — because it went into the other queue.",
      activeCodeLines: [1, 14],
      state: {
        phase: "done",
        callStack: [],
        microtasks: [],
        taskQueue: [],
        stackEmpty: true,
        drainingMicrotasks: false,
        note: "start → end → promise 1 → promise 2 → timer → promise inside timer → timer inside promise",
      },
    },
  ];
}

export function buildInitialSteps({ scenario }: MicrotaskInputs): ExecutionStep<MicrotaskStepState>[] {
  if (scenario === "rule") return ruleSteps();
  if (scenario === "drain") return drainSteps();
  if (scenario === "between") return betweenSteps();
  return allTogetherSteps();
}
