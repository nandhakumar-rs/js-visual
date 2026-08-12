import type { ExecutionStep } from "@/lib/execution/types";
import type { ClosuresInputs, ClosuresStepState, ClosureVarEntry } from "./types";

const createCounter: ClosureVarEntry = { name: "createCounter", displayValue: "ƒ", status: "set" };
const counterA: ClosureVarEntry = { name: "counterA", displayValue: "ƒ", status: "set" };
const counterB: ClosureVarEntry = { name: "counterB", displayValue: "ƒ", status: "set" };

/** Every scenario opens on the same beat: only the factory exists so far. */
const globalReady: ExecutionStep<ClosuresStepState> = {
  id: "global-ready",
  title: "Global scope is ready",
  description:
    "The script begins in the global scope, where createCounter is declared. Nothing has called it yet, so no count exists.",
  whyExplanation:
    "`createCounter` is only a function so far. The `count` variable is created by calling it, not by declaring it.",
  activeCodeLines: [1],
  state: {
    phase: "before-call",
    globalVars: [createCounter],
    factoryOpen: false,
    factoryVars: [],
    closures: [],
  },
};

function oneCounterSteps(): ExecutionStep<ClosuresStepState>[] {
  return [
    globalReady,
    {
      id: "factory-runs",
      title: "createCounter() runs",
      description:
        "Calling createCounter() opens a function scope, and let count = 0 creates a variable that belongs to this call.",
      whyExplanation:
        "This call gets its own scope. `count` lives there — not in the global scope, and not shared with any other call.",
      activeCodeLines: [10, 2],
      state: {
        phase: "call-running",
        globalVars: [createCounter],
        factoryOpen: true,
        factoryVars: [{ name: "count", displayValue: "0", status: "set" }],
        closures: [],
      },
    },
    {
      id: "inner-created",
      title: "The inner function is created",
      description:
        "The function being returned is created inside that same scope, so it can see count. It is not called yet.",
      whyExplanation:
        "The inner function is written inside `createCounter`, so `count` is one of the variables it can reach. That link is fixed the moment the function is created.",
      activeCodeLines: [4, 5, 6, 7],
      state: {
        phase: "call-running",
        globalVars: [createCounter],
        factoryOpen: true,
        factoryVars: [{ name: "count", displayValue: "0", status: "set" }],
        closures: [],
      },
    },
    {
      id: "call-ends",
      title: "createCounter() finishes, but count stays",
      description:
        "The call returns and its frame is gone. Normally its variables would go with it — but counterA still holds the returned function, which still needs count.",
      whyExplanation:
        "The returned function keeps a reference to the scope it was created in, so that scope cannot be discarded. `counterA` and that kept-alive scope together are the closure.",
      activeCodeLines: [10],
      state: {
        phase: "call-finished",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [{ id: "counterA", label: "counterA's closure", count: 0, status: "retained" }],
        activeClosureId: "counterA",
      },
    },
    {
      id: "first-call",
      title: "counterA() runs — count becomes 1",
      description: "Calling counterA() runs count++ inside the retained scope and returns the new value.",
      whyExplanation:
        "`count++` updates the same variable that was created back in step 2. It survived the call that made it, so it can keep counting.",
      activeCodeLines: [12, 5, 6],
      consoleOutput: [
        { id: "one-cmd-1", kind: "command", content: "console.log(counterA())" },
        { id: "one-out-1", kind: "output", content: "1" },
      ],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 1, previousCount: 0, status: "updating" },
        ],
        activeClosureId: "counterA",
      },
    },
    {
      id: "second-call",
      title: "counterA() runs again — count becomes 2",
      description: "The second call picks up where the first left off, because it reads and updates the same count.",
      whyExplanation:
        "Nothing reset `count` between the two calls. The closure is the reason the value persists from one call to the next.",
      activeCodeLines: [13, 5, 6],
      consoleOutput: [
        { id: "one-cmd-2", kind: "command", content: "console.log(counterA())" },
        { id: "one-out-2", kind: "output", content: "2" },
      ],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 2, previousCount: 1, status: "updating" },
        ],
        activeClosureId: "counterA",
      },
    },
  ];
}

function twoCountersSteps(): ExecutionStep<ClosuresStepState>[] {
  return [
    globalReady,
    {
      id: "counter-a-created",
      title: "counterA is created",
      description:
        "The first call to createCounter() runs, creates its own count, returns the inner function, and finishes.",
      whyExplanation:
        "This call's `count` is kept alive because `counterA` holds the function that was created alongside it.",
      activeCodeLines: [10],
      state: {
        phase: "call-finished",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [{ id: "counterA", label: "counterA's closure", count: 0, status: "retained" }],
        activeClosureId: "counterA",
      },
    },
    {
      id: "counter-b-created",
      title: "counterB is created",
      description:
        "The second call runs the same function body again — and line 2 creates a brand new count, unrelated to the first.",
      whyExplanation:
        "`let count = 0;` runs once per call. Two calls means two separate variables, each kept alive by its own returned function.",
      activeCodeLines: [11],
      state: {
        phase: "call-finished",
        globalVars: [createCounter, counterA, counterB],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 0, status: "retained" },
          { id: "counterB", label: "counterB's closure", count: 0, status: "retained" },
        ],
        activeClosureId: "counterB",
      },
    },
    {
      id: "call-a",
      title: "counterA() runs — its count becomes 1",
      description: "counterA() updates only the count in its own closure.",
      whyExplanation: "`counterA` can only reach the scope it was created in. It has no way to touch `counterB`'s `count`.",
      activeCodeLines: [13, 5, 6],
      consoleOutput: [
        { id: "two-cmd-a", kind: "command", content: "console.log(counterA())" },
        { id: "two-out-a", kind: "output", content: "1" },
      ],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA, counterB],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 1, previousCount: 0, status: "updating" },
          { id: "counterB", label: "counterB's closure", count: 0, status: "retained" },
        ],
        activeClosureId: "counterA",
      },
    },
    {
      id: "call-b",
      title: "counterB() runs — and also logs 1",
      description:
        "counterB() logs 1, not 2. Its count was never touched by the earlier call, so it is still starting from 0.",
      whyExplanation:
        "The two counters share the same function body but not the same variable. `counterB`'s `count` goes from 0 to 1 on its own first call.",
      activeCodeLines: [14, 5, 6],
      consoleOutput: [
        { id: "two-cmd-b", kind: "command", content: "console.log(counterB())" },
        { id: "two-out-b", kind: "output", content: "1" },
      ],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA, counterB],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 1, status: "retained" },
          { id: "counterB", label: "counterB's closure", count: 1, previousCount: 0, status: "updating" },
        ],
        activeClosureId: "counterB",
      },
    },
    {
      id: "two-counts",
      title: "One line, two variables",
      description:
        "Line 2 ran twice — once per call to createCounter(). That is why there are two counts on screen instead of one.",
      whyExplanation:
        "A closure is created once per call, not once per function. Calling `createCounter()` twice produced two independent scopes.",
      activeCodeLines: [2],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA, counterB],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 1, status: "retained" },
          { id: "counterB", label: "counterB's closure", count: 1, status: "retained" },
        ],
      },
    },
  ];
}

function fromOutsideSteps(): ExecutionStep<ClosuresStepState>[] {
  return [
    globalReady,
    {
      id: "factory-runs-outside",
      title: "createCounter() runs",
      description: "The call opens its own scope and creates count there, exactly as before.",
      whyExplanation: "`count` is declared inside `createCounter`, so it belongs to that call's scope from the start.",
      activeCodeLines: [10, 2],
      state: {
        phase: "call-running",
        globalVars: [createCounter],
        factoryOpen: true,
        factoryVars: [{ name: "count", displayValue: "0", status: "set" }],
        closures: [],
      },
    },
    {
      id: "retained-outside",
      title: "The call ends and count is retained",
      description: "counterA now holds the returned function, and the scope holding count is kept alive for it.",
      whyExplanation:
        "The scope survives because the returned function still references it — not because anything made `count` global.",
      activeCodeLines: [10],
      state: {
        phase: "call-finished",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [{ id: "counterA", label: "counterA's closure", count: 0, status: "retained" }],
        activeClosureId: "counterA",
      },
    },
    {
      id: "call-updates",
      title: "counterA() updates its private count",
      description: "Calling counterA() moves count from 0 to 1. That is the only route in.",
      whyExplanation:
        "The returned function is the single door into that scope. Everything the outside world can do to `count` has to go through it.",
      activeCodeLines: [11, 5, 6],
      consoleOutput: [{ id: "out-cmd", kind: "command", content: "counterA()" }],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [
          { id: "counterA", label: "counterA's closure", count: 1, previousCount: 0, status: "updating" },
        ],
        activeClosureId: "counterA",
      },
    },
    {
      id: "outside-search",
      title: "Global code asks for count",
      description:
        "console.log(count) runs in the global scope. JavaScript searches the scopes around that line for a variable named count.",
      whyExplanation:
        "The search starts where the code is written. From the global scope there is nothing further out to search, and JavaScript never searches inward into a closure.",
      activeCodeLines: [13],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [{ id: "counterA", label: "counterA's closure", count: 1, status: "unreachable" }],
        failedRead: { variable: "count", searched: ["Global"] },
      },
    },
    {
      id: "outside-error",
      title: "The search ends without finding it",
      description:
        "No binding named count exists in the global scope, so the program throws. The count inside the closure is alive, just not reachable from here.",
      whyExplanation:
        "This is the closure doing both of its jobs at once: `count` is kept alive for `counterA`, and kept private from everything else.",
      activeCodeLines: [13],
      consoleOutput: [
        { id: "err-cmd", kind: "command", content: "console.log(count)" },
        { id: "err-out", kind: "error", content: "Uncaught ReferenceError: count is not defined" },
      ],
      state: {
        phase: "using-closure",
        globalVars: [createCounter, counterA],
        factoryOpen: false,
        factoryVars: [],
        closures: [{ id: "counterA", label: "counterA's closure", count: 1, status: "unreachable" }],
        failedRead: { variable: "count", searched: ["Global"] },
      },
    },
  ];
}

export function buildInitialSteps({ scenario }: ClosuresInputs): ExecutionStep<ClosuresStepState>[] {
  if (scenario === "one-counter") return oneCounterSteps();
  if (scenario === "two-counters") return twoCountersSteps();
  return fromOutsideSteps();
}
