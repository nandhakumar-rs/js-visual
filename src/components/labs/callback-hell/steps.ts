import type { ExecutionStep } from "@/lib/execution/types";
import type { CallbackHellInputs, CallbackHellStepState, PipelineStep } from "./types";

const USER = '{ id: 1, name: "Maya" }';
const ORDERS = "[{ id: 77 }]";
const ITEMS = "[{ id: 5, supplierId: 9 }]";
const SUPPLIER = '{ id: 9, name: "Acme" }';

function step(
  id: string,
  label: string,
  depth: number,
  status: PipelineStep["status"],
  produced?: { name: string; displayValue: string },
  extra?: Partial<PipelineStep>
): PipelineStep {
  return { id, label, depth, status, produced, ...extra };
}

function twoStepsSteps(): ExecutionStep<CallbackHellStepState>[] {
  const user = (status: PipelineStep["status"], produced?: PipelineStep["produced"]) =>
    step("getUser", "getUser(1, ...)", 1, status, produced);
  const orders = (status: PipelineStep["status"], produced?: PipelineStep["produced"]) =>
    step("getOrders", "getOrders(user.id, ...)", 2, status, produced);

  return [
    {
      id: "call-1",
      title: "getUser is called",
      description:
        "The first step starts. Nothing is nested yet — this is one ordinary call with a callback, exactly like the previous lesson.",
      whyExplanation:
        "At this point the code is flat. The pyramid only starts once a second step needs what this one produces.",
      activeCodeLines: [1],
      state: { phase: "calling", depth: 1, steps: [user("running")] },
    },
    {
      id: "result-1",
      title: "The user arrives — inside the callback",
      description:
        "getUser calls back with the user. That user is a parameter of the callback, so it exists only inside those braces.",
      whyExplanation:
        "This is the whole cause of callback hell. The result is delivered as an argument, so it is in scope inside the callback and nowhere else.",
      activeCodeLines: [1],
      state: {
        phase: "result-arrives",
        depth: 1,
        steps: [user("done", { name: "user", displayValue: USER })],
        note: "user exists inside this callback only. Outside it, there is no user.",
      },
    },
    {
      id: "call-2",
      title: "So getOrders has to be written in there",
      description:
        "getOrders needs user.id. The only place user.id can be read is inside getUser's callback, so the second call goes inside it — one level deeper.",
      whyExplanation:
        "The nesting is not a style choice. Writing `getOrders` after the closing brace would be a `ReferenceError`, because `user` does not exist out there.",
      activeCodeLines: [2],
      state: {
        phase: "nesting-deeper",
        depth: 2,
        steps: [user("done", { name: "user", displayValue: USER }), orders("running")],
      },
    },
    {
      id: "result-2",
      title: "The orders arrive — inside the second callback",
      description:
        "The same thing happens again, one level down. orders is a parameter of the inner callback, so it too is trapped inside its own braces.",
      whyExplanation:
        "Every step repeats this beat. A third step would need `orders`, so it would have to go inside here — and the code would move right again.",
      activeCodeLines: [2],
      state: {
        phase: "result-arrives",
        depth: 2,
        steps: [
          user("done", { name: "user", displayValue: USER }),
          orders("done", { name: "orders", displayValue: ORDERS }),
        ],
      },
    },
    {
      id: "log",
      title: "The innermost callback logs the result",
      description: "Two steps in, the work finally happens on line 3 — the most indented line in the program.",
      activeCodeLines: [3],
      consoleOutput: [{ id: "two-out", kind: "output", content: ORDERS }],
      state: {
        phase: "done",
        depth: 2,
        steps: [
          user("done", { name: "user", displayValue: USER }),
          orders("done", { name: "orders", displayValue: ORDERS }),
        ],
      },
    },
    {
      id: "shape",
      title: "Two steps, two levels, two closing braces",
      description:
        "Lines 4 and 5 close the two callbacks in reverse order. Switch to Four steps and watch every one of these numbers double.",
      whyExplanation:
        "One dependent step costs one level of indentation and one more `});` at the bottom. That is the trade the pattern makes, every time.",
      activeCodeLines: [4, 5],
      state: {
        phase: "done",
        depth: 2,
        steps: [
          user("done", { name: "user", displayValue: USER }),
          orders("done", { name: "orders", displayValue: ORDERS }),
        ],
      },
    },
  ];
}

function fourStepsSteps(): ExecutionStep<CallbackHellStepState>[] {
  const chain: PipelineStep[] = [
    step("getUser", "getUser(1, ...)", 1, "waiting", { name: "user", displayValue: USER }),
    step("getOrders", "getOrders(user.id, ...)", 2, "waiting", { name: "orders", displayValue: ORDERS }),
    step("getItems", "getItems(orders[0].id, ...)", 3, "waiting", { name: "items", displayValue: ITEMS }),
    step("getSupplier", "getSupplier(items[0].supplierId, ...)", 4, "waiting", {
      name: "supplier",
      displayValue: SUPPLIER,
    }),
  ];

  /** The chain as it looks once `reached` levels have run. */
  const upTo = (reached: number): PipelineStep[] =>
    chain.slice(0, reached).map((s, i) => ({
      ...s,
      status: i === reached - 1 ? "running" : "done",
      produced: i === reached - 1 ? undefined : s.produced,
    }));

  const level = (n: number, line: number): ExecutionStep<CallbackHellStepState> => ({
    id: `call-${n}`,
    title: `Level ${n}: ${chain[n - 1].label}`,
    description:
      n === 1
        ? "The chain starts flat, on line 1."
        : `This call needs what level ${n - 1} produced, so it is written inside level ${
            n - 1
          }'s callback — ${n} levels deep now.`,
    whyExplanation:
      n === 1
        ? "One call, no nesting. The cost only appears once a step depends on this one's result."
        : `Each level adds two spaces of indentation. At level ${n} the code starts ${(n - 1) * 2} characters further right than it did on line 1.`,
    activeCodeLines: [line],
    state: { phase: n === 1 ? "calling" : "nesting-deeper", depth: n, steps: upTo(n) },
  });

  return [
    level(1, 1),
    level(2, 2),
    level(3, 3),
    level(4, 4),
    {
      id: "log",
      title: "Four steps later, the actual work",
      description:
        "Line 5 is the only line that does anything with the data. It sits eight characters in, behind four layers of callback.",
      whyExplanation:
        "The ratio is the complaint: one line of useful work, wrapped in eight lines of structure that exist only to sequence it.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "four-out", kind: "output", content: SUPPLIER }],
      state: {
        phase: "done",
        depth: 4,
        steps: chain.map((s) => ({ ...s, status: "done" as const })),
      },
    },
    {
      id: "staircase",
      title: "And then four lines of closing braces",
      description:
        "Lines 6 to 9 do nothing but close what was opened, in reverse order. This staircase is what people mean by the pyramid of doom.",
      whyExplanation:
        "Adding a fifth step means re-indenting everything below it and adding a fifth `});`. Removing one means the same work in reverse.",
      activeCodeLines: [6, 7, 8, 9],
      state: {
        phase: "done",
        depth: 4,
        steps: chain.map((s) => ({ ...s, status: "done" as const })),
        note: "Four steps · four levels · four closing braces.",
      },
    },
  ];
}

function failsSteps(): ExecutionStep<CallbackHellStepState>[] {
  const user = (status: PipelineStep["status"], extra?: Partial<PipelineStep>) =>
    step("getUser", "getUser(1, ...)", 1, status, { name: "user", displayValue: USER }, {
      hasErrorCheck: true,
      ...extra,
    });
  const orders = (status: PipelineStep["status"], extra?: Partial<PipelineStep>) =>
    step("getOrders", "getOrders(user.id, ...)", 2, status, undefined, { hasErrorCheck: true, ...extra });
  const items = (status: PipelineStep["status"]) =>
    step("getItems", "getItems(orders[0].id, ...)", 3, status, undefined, { hasErrorCheck: true });

  return [
    {
      id: "call-1",
      title: "Every level now carries its own error check",
      description:
        "The callbacks take (error, result) instead of just the result, and each one opens with the same check on lines 2, 4 and 6.",
      whyExplanation:
        "The check has to be repeated because an error handed to one level is invisible to every other level. There is nowhere shared to put it.",
      activeCodeLines: [1, 2],
      state: {
        phase: "calling",
        depth: 1,
        errorChecks: 3,
        steps: [user("running"), orders("waiting"), items("waiting")],
      },
    },
    {
      id: "check-1-passes",
      title: "Level 1 succeeds, so its check does nothing",
      description: "getUser calls back with error set to null, so line 2 falls through and the chain continues.",
      whyExplanation:
        "On a successful run every one of these checks is a line that costs reading effort and changes nothing.",
      activeCodeLines: [2],
      state: {
        phase: "result-arrives",
        depth: 1,
        errorChecks: 3,
        steps: [user("done"), orders("waiting"), items("waiting")],
      },
    },
    {
      id: "call-2",
      title: "Level 2 starts",
      description: "getOrders is called with the user's id, one level deeper, and the program waits on it.",
      activeCodeLines: [3],
      state: {
        phase: "nesting-deeper",
        depth: 2,
        errorChecks: 3,
        steps: [user("done"), orders("running"), items("waiting")],
      },
    },
    {
      id: "fail-2",
      title: "getOrders calls back with an error",
      description:
        "This time the first argument is an Error instead of null. The failure is delivered to level 2's callback and to nothing else.",
      whyExplanation:
        "Level 1 has already returned and level 3 has not started, so neither of their checks can see this. Only the level that received it can act.",
      activeCodeLines: [3, 4],
      state: {
        phase: "failed",
        depth: 2,
        errorChecks: 3,
        steps: [
          user("done"),
          orders("failed", { errorCaught: true, produced: { name: "error", displayValue: "Error: No orders for user 1" } }),
          items("waiting"),
        ],
      },
    },
    {
      id: "handled",
      title: "The level-2 check fires and returns",
      description:
        "Line 4 logs the failure and returns, which stops the rest of that callback — so getItems is never called.",
      whyExplanation:
        "`return` here only ends this one callback. There is no outer handler it falls back to, which is why every level needs its own.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "fail-out", kind: "output", content: "Failed: No orders for user 1" }],
      state: {
        phase: "failed",
        depth: 2,
        errorChecks: 3,
        steps: [
          user("done"),
          orders("failed", { errorCaught: true, produced: { name: "error", displayValue: "Error: No orders for user 1" } }),
          items("never-ran"),
        ],
      },
    },
    {
      id: "dead-code",
      title: "Lines 5 to 7 never ran at all",
      description:
        "getItems, its error check on line 6, and the log on line 7 were all skipped. On this run, that third copy of the check was dead code.",
      whyExplanation:
        "Three identical checks were written; one of them did the work. That is the duplication cost — and it grows by one with every step added.",
      activeCodeLines: [5, 6, 7],
      state: {
        phase: "failed",
        depth: 2,
        errorChecks: 3,
        steps: [
          user("done"),
          orders("failed", { errorCaught: true, produced: { name: "error", displayValue: "Error: No orders for user 1" } }),
          items("never-ran"),
        ],
        note: "Three identical error checks, one of which mattered.",
      },
    },
  ];
}

export function buildInitialSteps({ scenario }: CallbackHellInputs): ExecutionStep<CallbackHellStepState>[] {
  if (scenario === "two-steps") return twoStepsSteps();
  if (scenario === "four-steps") return fourStepsSteps();
  return failsSteps();
}
