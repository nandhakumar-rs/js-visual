import type { ExecutionStep } from "@/lib/execution/types";
import type { VariableEntry } from "@/components/visualizers/ScopeBox";
import type { AsyncAwaitInputs, AsyncAwaitStepState } from "./types";

// Every ordering asserted below was observed by running the exact program from
// code.ts, not predicted. See the lesson's verification script.

const MAIN = { id: "main", label: "main()", isActive: false };
const MAIN_RUNNING = {
  id: "main",
  label: "main()",
  isActive: true,
  statusBadge: { text: "RUNNING", tone: "new" as const },
};

function frame(id: string, label: string, variables?: VariableEntry[]) {
  return {
    id,
    label,
    isActive: true,
    statusBadge: { text: "RUNNING", tone: "new" as const },
    variables,
  };
}

function bound(name: string, displayValue: string): VariableEntry {
  return { name, displayValue, status: "set" };
}

const USER = '{ id: 1, name: "Maya" }';
const ORDERS = '["#501", "#502"]';

/** Resumption chips read as what they are: the rest of a function, waiting. */
const RESUME_USER = { id: "resume-user", label: "resume load() at line 2" };
const RESUME_ORDERS = { id: "resume-orders", label: "resume load() at line 3" };

// ---------------------------------------------------------------------------
// 1. Two steps, in order
// ---------------------------------------------------------------------------

function topToBottomSteps(): ExecutionStep<AsyncAwaitStepState>[] {
  return [
    {
      id: "call",
      title: "load() is called like any other function",
      description:
        "Nothing about the call is special. The frame goes on the stack and the body starts running immediately.",
      whyExplanation:
        "An async function is not deferred. It runs synchronously from its first line until it reaches an await — which is why the word async on line 1 changes nothing about when the body starts.",
      activeCodeLines: [8],
      state: {
        phase: "running",
        callStack: [MAIN, frame("load", "load()")],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "await-user",
      title: "await — and load() leaves the stack",
      description:
        "getUser(1) hands back a pending promise. Rather than wait for it, load() suspends: its frame comes off the call stack entirely.",
      whyExplanation:
        "This is the whole mechanism. The function is parked with everything it had — the line it stopped on, its variables — and the stack is handed back so other work can use it.",
      activeCodeLines: [2],
      state: {
        phase: "suspending",
        callStack: [MAIN_RUNNING],
        suspended: { label: "load()", awaiting: "getUser(1)", resumeLine: 2 },
        awaited: { label: "getUser(1)", state: "pending" },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
        note: "The stack no longer holds load(). Nothing is blocked while it waits.",
      },
    },
    {
      id: "user-settles",
      title: "The promise fulfils — resuming is a microtask",
      description:
        "getUser(1) fulfils with the user. The rest of load() does not run on the spot; it joins the microtask queue, the same queue the previous lesson introduced.",
      whyExplanation:
        "Resuming after an await is scheduled exactly like a .then handler, because that is what it is. Every rule from the Microtask Queue lesson applies unchanged.",
      activeCodeLines: [2],
      state: {
        phase: "queued",
        callStack: [MAIN_RUNNING],
        suspended: { label: "load()", awaiting: "getUser(1)", resumeLine: 2 },
        awaited: { label: "getUser(1)", state: "fulfilled", value: USER },
        microtasks: [RESUME_USER],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "user-bound",
      title: "It resumes, and the value lands in const user",
      description:
        "load() goes back on the stack and continues from the await. The fulfilled value becomes the value of the await expression, so it binds to an ordinary const.",
      whyExplanation:
        "This is what a .then handler could not do. The result is a named variable in the function's own scope, not an argument that only exists inside a callback.",
      activeCodeLines: [2],
      state: {
        phase: "resumed",
        callStack: [MAIN, frame("load", "load()", [bound("user", USER)])],
        awaited: { label: "getUser(1)", state: "fulfilled", value: USER },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "await-orders",
      title: "The second await does exactly the same thing",
      description:
        "load() suspends again — and user goes with it. A suspended function keeps everything it had bound.",
      whyExplanation:
        "Nothing about the second await is different from the first. That sameness is why a five-step sequence reads no worse than a two-step one: each step costs one line, not one level of nesting.",
      activeCodeLines: [3],
      state: {
        phase: "suspending",
        callStack: [MAIN_RUNNING],
        suspended: {
          label: "load()",
          awaiting: "getOrders(user.id)",
          resumeLine: 3,
          variables: [bound("user", USER)],
        },
        awaited: { label: "getOrders(user.id)", state: "pending" },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
        note: "user survives the wait — it is part of the parked function, not of the stack.",
      },
    },
    {
      id: "orders-settle",
      title: "Fulfilled, queued, and resumed again",
      description:
        "getOrders resolves and the continuation is queued as a microtask, exactly as before.",
      activeCodeLines: [3],
      state: {
        phase: "queued",
        callStack: [MAIN_RUNNING],
        suspended: {
          label: "load()",
          awaiting: "getOrders(user.id)",
          resumeLine: 3,
          variables: [bound("user", USER)],
        },
        awaited: { label: "getOrders(user.id)", state: "fulfilled", value: ORDERS },
        microtasks: [RESUME_ORDERS],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "orders-bound",
      title: "Both results are now ordinary variables",
      description:
        "user and orders sit side by side in one scope. Reaching both at once needed nesting with callbacks and a closure with .then.",
      whyExplanation:
        "Two awaits, two consts, one scope, no indentation. This is the shape the chain in the Promises lesson was building towards.",
      activeCodeLines: [3],
      state: {
        phase: "resumed",
        callStack: [
          MAIN,
          frame("load", "load()", [bound("user", USER), bound("orders", ORDERS)]),
        ],
        awaited: { label: "getOrders(user.id)", state: "fulfilled", value: ORDERS },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "log",
      title: "And the last line just reads them",
      description: "No handler, no callback — the code after the awaits is ordinary code.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "tb-orders", kind: "output", content: '["#501", "#502"]' }],
      state: {
        phase: "done",
        callStack: [
          MAIN,
          frame("load", "load()", [bound("user", USER), bound("orders", ORDERS)]),
        ],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
        note: "Two asynchronous steps, written as three sequential statements.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 2. await doesn't block
// ---------------------------------------------------------------------------

function notBlockingSteps(): ExecutionStep<AsyncAwaitStepState>[] {
  const resume = { id: "resume-b", label: "resume load() at line 3" };

  return [
    {
      id: "start",
      title: "start logs first",
      description: "Ordinary top-level code, running on the stack.",
      activeCodeLines: [7],
      consoleOutput: [{ id: "nb-start", kind: "output", content: "start" }],
      state: {
        phase: "running",
        callStack: [MAIN_RUNNING],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "call",
      title: "load() is called — and A logs immediately",
      description:
        "Calling an async function does not schedule it for later. Its body runs right now, synchronously, up to the first await.",
      whyExplanation:
        "A common misreading is that async makes the whole function asynchronous. It does not: everything before the first await runs in the same tick as the call.",
      activeCodeLines: [8, 2],
      consoleOutput: [{ id: "nb-a", kind: "output", content: "A" }],
      state: {
        phase: "running",
        callStack: [MAIN, frame("load", "load()")],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "suspend",
      title: "await — load() steps aside",
      description:
        "load() suspends and its frame leaves the stack. The promise is already fulfilled, so the continuation is queued as a microtask straight away.",
      whyExplanation:
        "Queued, not run. Even an already-fulfilled promise never resumes the function inline — the continuation always goes through the microtask queue.",
      activeCodeLines: [3],
      state: {
        phase: "suspending",
        callStack: [MAIN_RUNNING],
        suspended: { label: "load()", awaiting: "getUser(1)", resumeLine: 3 },
        awaited: { label: "getUser(1)", state: "fulfilled", value: USER },
        microtasks: [resume],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "end",
      title: "end logs — while load() is still paused",
      description:
        "This is the line that proves it. The thread was never held: it carried straight on to the next statement after the call.",
      whyExplanation:
        "await pauses one function, not the program. Everything queued behind it — this line, a click handler, a repaint — still gets its turn.",
      activeCodeLines: [9],
      consoleOutput: [{ id: "nb-end", kind: "output", content: "end" }],
      state: {
        phase: "waiting",
        callStack: [MAIN_RUNNING],
        suspended: { label: "load()", awaiting: "getUser(1)", resumeLine: 3 },
        awaited: { label: "getUser(1)", state: "fulfilled", value: USER },
        microtasks: [resume],
        taskQueue: [],
        showTaskQueue: false,
        note: "Paused off the stack, while the stack got on with something else.",
      },
    },
    {
      id: "drain",
      title: "The stack empties, so the microtask runs",
      description:
        "There is no more synchronous code. The loop drains the microtask queue and picks up the continuation.",
      activeCodeLines: [3],
      state: {
        phase: "queued",
        callStack: [],
        suspended: { label: "load()", awaiting: "getUser(1)", resumeLine: 3 },
        awaited: { label: "getUser(1)", state: "fulfilled", value: USER },
        microtasks: [resume],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "resume",
      title: "load() comes back and finishes",
      description: "It continues from the line it stopped on, and B logs last.",
      whyExplanation:
        "The delay between A and B was never the thread waiting. It was load() sitting off the stack until the loop had nothing synchronous left to do.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "nb-b", kind: "output", content: "B" }],
      state: {
        phase: "resumed",
        callStack: [frame("load", "load()")],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
        note: "start → A → end → B",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 3. One try/catch
// ---------------------------------------------------------------------------

function failsSteps(): ExecutionStep<AsyncAwaitStepState>[] {
  const resumeThrow = { id: "f-resume-throw", label: "resume load() at line 4" };
  const ERROR = "Error: Could not load orders";

  return [
    {
      id: "call",
      title: "load() runs into the try block",
      description: "An ordinary try, wrapping what are about to be two asynchronous steps.",
      whyExplanation:
        "With callbacks this could not work: the callback ran long after try had returned, so there was nothing left to catch. That is the problem this scenario is about.",
      activeCodeLines: [11],
      state: {
        phase: "running",
        callStack: [MAIN, frame("load", "load()")],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "await-user",
      title: "The first step succeeds",
      description:
        "load() suspends, the promise fulfils, its continuation runs off the microtask queue, and user is bound — the same round trip as the first scenario.",
      activeCodeLines: [3],
      state: {
        phase: "resumed",
        callStack: [MAIN, frame("load", "load()", [bound("user", USER)])],
        awaited: { label: "getUser(1)", state: "fulfilled", value: USER },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "await-orders",
      title: "The second step is awaited",
      description: "load() suspends again, waiting on getOrders.",
      activeCodeLines: [4],
      state: {
        phase: "suspending",
        callStack: [MAIN_RUNNING],
        suspended: {
          label: "load()",
          awaiting: "getOrders(user.id)",
          resumeLine: 4,
          variables: [bound("user", USER)],
        },
        awaited: { label: "getOrders(user.id)", state: "pending" },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "rejects",
      title: "It rejects — and that is queued too",
      description:
        "A rejection is scheduled exactly like a value. The continuation joins the microtask queue in the same way; only what it does on arrival differs.",
      whyExplanation:
        "Fulfilled and rejected are both settlements. The queue does not treat them differently — the function is resumed either way.",
      activeCodeLines: [4],
      state: {
        phase: "queued",
        callStack: [MAIN_RUNNING],
        suspended: {
          label: "load()",
          awaiting: "getOrders(user.id)",
          resumeLine: 4,
          variables: [bound("user", USER)],
        },
        awaited: { label: "getOrders(user.id)", state: "rejected", value: ERROR },
        microtasks: [resumeThrow],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
    {
      id: "throws",
      title: "The await line throws",
      description:
        "load() resumes, and instead of producing a value the await throws the rejection reason — right there on line 4, inside the try.",
      whyExplanation:
        "This is the piece that makes try/catch work. The rejection is turned back into a real throw at the exact line that awaited it, so it is inside the block after all.",
      activeCodeLines: [4],
      state: {
        phase: "resumed",
        callStack: [
          MAIN,
          {
            id: "load",
            label: "load()",
            isActive: true,
            statusBadge: { text: "THREW", tone: "error" as const },
            variables: [bound("user", USER)],
          },
        ],
        awaited: { label: "getOrders(user.id)", state: "rejected", value: ERROR },
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
        note: "Line 5 never runs — the throw skips the rest of the try block.",
      },
    },
    {
      id: "catch",
      title: "One catch covers both steps",
      description:
        "Control jumps to the catch block with the error object. Either await could have failed and this same block would have handled it.",
      whyExplanation:
        "The callback version needed one if (error) check per step. Here the number of failure paths does not grow with the number of steps.",
      activeCodeLines: [7],
      consoleOutput: [
        { id: "fl-failed", kind: "error", content: "Failed: Could not load orders" },
      ],
      state: {
        phase: "done",
        callStack: [
          MAIN,
          {
            id: "load",
            label: "load()",
            isActive: true,
            statusBadge: { text: "CAUGHT IT", tone: "success" as const },
            variables: [bound("user", USER)],
          },
        ],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: false,
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 4. All together — the canonical ordering puzzle
// ---------------------------------------------------------------------------

function allTogetherSteps(): ExecutionStep<AsyncAwaitStepState>[] {
  const timer = { id: "at-timer", label: '() => log("setTimeout")' };
  const resumeAsync1 = { id: "at-resume", label: "resume async1() at line 6" };
  const then = { id: "at-then", label: '() => log("promise2")' };

  return [
    {
      id: "script-start",
      title: "script start",
      description: "Top-level code, running on the stack like any other statement.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "at-1", kind: "output", content: "script start" }],
      state: {
        phase: "running",
        callStack: [MAIN_RUNNING],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: true,
      },
    },
    {
      id: "timer",
      title: "The timer is registered — and goes to the task queue",
      description:
        "Scheduled second, and it will finish last. Its callback waits in the violet queue from the Event Loop lesson.",
      activeCodeLines: [2],
      state: {
        phase: "running",
        callStack: [MAIN_RUNNING],
        microtasks: [],
        taskQueue: [timer],
        showTaskQueue: true,
      },
    },
    {
      id: "async1-start",
      title: "async1() is called, and starts running at once",
      description:
        "The call on line 11 puts async1 on the stack and its first line logs immediately — before anything is awaited.",
      activeCodeLines: [11, 5],
      consoleOutput: [{ id: "at-2", kind: "output", content: "async1 start" }],
      state: {
        phase: "running",
        callStack: [MAIN, frame("async1", "async1()")],
        microtasks: [],
        taskQueue: [timer],
        showTaskQueue: true,
      },
    },
    {
      id: "async2-runs",
      title: "await async2() calls async2 first",
      description:
        "The expression has to be evaluated before it can be awaited, so async2 runs its whole body synchronously and logs.",
      whyExplanation:
        "await does not delay the call. It only decides what happens after the call has produced its promise — which is why async2 logs here rather than later.",
      activeCodeLines: [6, 9],
      consoleOutput: [{ id: "at-3", kind: "output", content: "async2" }],
      state: {
        phase: "running",
        callStack: [MAIN, frame("async1", "async1()"), frame("async2", "async2()")],
        microtasks: [],
        taskQueue: [timer],
        showTaskQueue: true,
      },
    },
    {
      id: "async1-suspends",
      title: "Now async1 suspends",
      description:
        "async2 returned an already-fulfilled promise, so async1 leaves the stack and its continuation joins the microtask queue — first in line.",
      activeCodeLines: [6],
      state: {
        phase: "suspending",
        callStack: [MAIN_RUNNING],
        suspended: { label: "async1()", awaiting: "async2()", resumeLine: 6 },
        awaited: { label: "async2()", state: "fulfilled", value: "undefined" },
        microtasks: [resumeAsync1],
        taskQueue: [timer],
        showTaskQueue: true,
        note: "Being first into the microtask queue is what puts async1 end ahead of promise2.",
      },
    },
    {
      id: "promise1",
      title: "promise1 logs — the executor is synchronous",
      description:
        "The function passed to new Promise runs immediately, so promise1 logs here. Its .then handler is queued behind async1's continuation.",
      whyExplanation:
        "The executor is not deferred; only the handlers are. This is the step people misplace when they answer this question from memory.",
      activeCodeLines: [13],
      consoleOutput: [{ id: "at-4", kind: "output", content: "promise1" }],
      state: {
        phase: "waiting",
        callStack: [MAIN_RUNNING],
        suspended: { label: "async1()", awaiting: "async2()", resumeLine: 6 },
        microtasks: [resumeAsync1, then],
        taskQueue: [timer],
        showTaskQueue: true,
      },
    },
    {
      id: "script-end",
      title: "script end — every synchronous line is now done",
      description:
        "Four logs so far, and not one of them came from a queue. Two microtasks and one task are waiting.",
      activeCodeLines: [16],
      consoleOutput: [{ id: "at-5", kind: "output", content: "script end" }],
      state: {
        phase: "waiting",
        callStack: [MAIN_RUNNING],
        suspended: { label: "async1()", awaiting: "async2()", resumeLine: 6 },
        microtasks: [resumeAsync1, then],
        taskQueue: [timer],
        showTaskQueue: true,
        note: "script start → async1 start → async2 → promise1 → script end",
      },
    },
    {
      id: "resume-async1",
      title: "The stack empties, and microtasks go first",
      description:
        "async1's continuation was queued before the .then handler, so it runs first: async1 end.",
      activeCodeLines: [7],
      consoleOutput: [{ id: "at-6", kind: "output", content: "async1 end" }],
      state: {
        phase: "resumed",
        callStack: [frame("async1", "async1()")],
        microtasks: [then],
        taskQueue: [timer],
        showTaskQueue: true,
      },
    },
    {
      id: "promise2",
      title: "The same drain continues into promise2",
      description:
        "The loop does not take a task between two microtasks. It empties the whole microtask queue first.",
      activeCodeLines: [14],
      consoleOutput: [{ id: "at-7", kind: "output", content: "promise2" }],
      state: {
        phase: "resumed",
        callStack: [frame("then", "then handler")],
        microtasks: [],
        taskQueue: [timer],
        showTaskQueue: true,
      },
    },
    {
      id: "timer-runs",
      title: "Only now the timer",
      description:
        "Registered on line 2 with a delay of 0, and still last — because it is the only one of the four that went into the task queue.",
      whyExplanation:
        "Three lessons in one program: synchronous code first, then the whole microtask queue, then one task. await changes none of it — it just decides which queue a continuation lands in.",
      activeCodeLines: [2],
      consoleOutput: [{ id: "at-8", kind: "output", content: "setTimeout" }],
      state: {
        phase: "done",
        callStack: [frame("timer", "timer callback")],
        microtasks: [],
        taskQueue: [],
        showTaskQueue: true,
        note: "script start → async1 start → async2 → promise1 → script end → async1 end → promise2 → setTimeout",
      },
    },
  ];
}

export function buildInitialSteps({
  scenario,
}: AsyncAwaitInputs): ExecutionStep<AsyncAwaitStepState>[] {
  if (scenario === "top-to-bottom") return topToBottomSteps();
  if (scenario === "not-blocking") return notBlockingSteps();
  if (scenario === "fails") return failsSteps();
  return allTogetherSteps();
}
