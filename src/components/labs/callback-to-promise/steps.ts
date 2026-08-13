import type { ExecutionStep } from "@/lib/execution/types";
import type { ChainLink, PromisesInputs, PromisesStepState } from "./types";

const USER = '{ id: 1, name: "Maya" }';
const ORDERS = "[{ id: 77 }]";
const ITEMS = "[{ id: 5, supplierId: 9 }]";
const REASON = "Error: No orders for user 1";

const HEAD = "getUser(1)";
const THEN_ORDERS = ".then((user) => getOrders(user.id))";
const THEN_ITEMS = ".then((orders) => getItems(orders[0].id))";
const THEN_LOG = ".then((items) => console.log(items))";
const CATCH = ".catch((error) => …)";

function link(id: string, label: string, status: ChainLink["status"], extra?: Partial<ChainLink>): ChainLink {
  return { id, label, status, ...extra };
}

function valueSteps(): ExecutionStep<PromisesStepState>[] {
  const promise = (status: ChainLink["status"], extra?: Partial<ChainLink>) =>
    link("promise", HEAD, status, extra);

  return [
    {
      id: "call",
      title: "getUser(1) hands back a promise straight away",
      description:
        "The call returns before any user exists. What comes back is a promise: an object standing in for a result that has not arrived yet.",
      whyExplanation:
        "In the Callbacks lesson this same call returned nothing useful. Here there is something to hold on to from the very first line.",
      activeCodeLines: [1],
      state: {
        phase: "pending",
        links: [promise("pending", { promiseState: "pending" })],
      },
    },
    {
      id: "log-promise",
      title: "It really is an ordinary value",
      description:
        "Logging it prints the object itself, not the user. It can be stored in a variable, passed to a function, or returned from one.",
      whyExplanation:
        "This is what the last lesson meant by making the result a value. A callback's result could never be held like this — it only existed inside the callback.",
      activeCodeLines: [3],
      consoleOutput: [{ id: "val-out-1", kind: "output", content: "Promise { <pending> }" }],
      state: {
        phase: "pending",
        links: [promise("pending", { promiseState: "pending" })],
        note: "A pending promise is a real value you can name and pass around.",
      },
    },
    {
      id: "settles",
      title: "A second later it settles",
      description: "The work finishes and the promise moves from pending to fulfilled, carrying the user as its value.",
      whyExplanation:
        "A promise has exactly one transition to make: pending to fulfilled, or pending to rejected. Once made, it is permanent.",
      activeCodeLines: [1],
      state: {
        phase: "settling",
        links: [promise("fulfilled", { promiseState: "fulfilled", value: USER })],
      },
    },
    {
      id: "handler",
      title: "The .then handler runs with that value",
      description:
        "Because the promise is fulfilled, the function passed to .then is called, and the user arrives as its argument.",
      activeCodeLines: [5, 6, 7],
      state: {
        phase: "handler-runs",
        links: [promise("fulfilled", { promiseState: "fulfilled", value: USER })],
      },
    },
    {
      id: "logged",
      title: "Maya is logged",
      description: "Line 6 reads the name off the user it was handed.",
      activeCodeLines: [6],
      consoleOutput: [{ id: "val-out-2", kind: "output", content: "Maya" }],
      state: {
        phase: "done",
        links: [promise("fulfilled", { promiseState: "fulfilled", value: USER })],
      },
    },
    {
      id: "settled-once",
      title: "It settled once, and cannot change again",
      description:
        "The promise is now permanently fulfilled with that user. Attaching another .then to it later would still hand back the same value, immediately.",
      whyExplanation:
        "The Callbacks lesson noted that nothing stops a callback being called twice, or never. A promise settles exactly once — that guarantee is built in.",
      activeCodeLines: [1],
      state: {
        phase: "done",
        links: [promise("fulfilled", { promiseState: "fulfilled", value: USER })],
        note: "Settled once, permanently. Handlers attached afterwards still receive the value.",
      },
    },
  ];
}

function chainSteps(): ExecutionStep<PromisesStepState>[] {
  return [
    {
      id: "head",
      title: "The chain starts with one promise",
      description: "getUser(1) returns a pending promise, exactly as in the first scenario. Everything else attaches to it.",
      activeCodeLines: [1],
      state: {
        phase: "pending",
        links: [
          link("head", HEAD, "pending", { promiseState: "pending" }),
          link("t1", THEN_ORDERS, "waiting"),
          link("t2", THEN_ITEMS, "waiting"),
          link("t3", THEN_LOG, "waiting"),
        ],
      },
    },
    {
      id: "then-1",
      title: ".then returns a new promise",
      description:
        "This is the key move. .then does not return the user — it returns a brand new promise, and that is what the next .then attaches to.",
      whyExplanation:
        "Because every `.then` hands back another promise, the handlers form a list. Nothing has to be written inside anything else.",
      activeCodeLines: [2],
      state: {
        phase: "settling",
        links: [
          link("head", HEAD, "fulfilled", { promiseState: "fulfilled", value: USER }),
          link("t1", THEN_ORDERS, "pending", { promiseState: "pending" }),
          link("t2", THEN_ITEMS, "waiting"),
          link("t3", THEN_LOG, "waiting"),
        ],
      },
    },
    {
      id: "returns-promise",
      title: "Returning a promise makes the chain wait",
      description:
        "The handler returns getOrders(user.id), which is itself a promise. Rather than fulfilling with that promise, this link waits for it and takes on its result.",
      whyExplanation:
        "This is how one step feeds the next without indenting. The value the next handler receives is the orders, not a promise wrapping them.",
      activeCodeLines: [2],
      state: {
        phase: "handler-runs",
        links: [
          link("head", HEAD, "fulfilled", { promiseState: "fulfilled", value: USER }),
          link("t1", THEN_ORDERS, "fulfilled", { promiseState: "fulfilled", value: ORDERS }),
          link("t2", THEN_ITEMS, "waiting"),
          link("t3", THEN_LOG, "waiting"),
        ],
      },
    },
    {
      id: "then-2",
      title: "The same three beats, one link down",
      description: "getItems runs the moment the orders arrive, and its promise becomes the next link.",
      whyExplanation:
        "Nothing new happens here. A chain is this one unit repeated, which is why the code stops changing shape as steps are added.",
      activeCodeLines: [3],
      state: {
        phase: "settling",
        links: [
          link("head", HEAD, "fulfilled", { promiseState: "fulfilled", value: USER }),
          link("t1", THEN_ORDERS, "fulfilled", { promiseState: "fulfilled", value: ORDERS }),
          link("t2", THEN_ITEMS, "fulfilled", { promiseState: "fulfilled", value: ITEMS }),
          link("t3", THEN_LOG, "waiting"),
        ],
      },
    },
    {
      id: "logged",
      title: "The last handler logs the items",
      description: "Line 4 is the end of the chain, and it sits at the same indentation as every other line.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "chain-out", kind: "output", content: ITEMS }],
      state: {
        phase: "done",
        links: [
          link("head", HEAD, "fulfilled", { promiseState: "fulfilled", value: USER }),
          link("t1", THEN_ORDERS, "fulfilled", { promiseState: "fulfilled", value: ORDERS }),
          link("t2", THEN_ITEMS, "fulfilled", { promiseState: "fulfilled", value: ITEMS }),
          link("t3", THEN_LOG, "fulfilled", { promiseState: "fulfilled", value: "undefined" }),
        ],
      },
    },
    {
      id: "flat",
      title: "Four lines, one level, read top to bottom",
      description:
        "The previous lesson wrote these same three steps as a seven-line pyramid three levels deep. Here every line is at the same indent, in the order they run.",
      whyExplanation:
        "Adding a fourth step adds one line, in the middle, and shifts nothing. That is the difference the shape makes.",
      activeCodeLines: [1, 2, 3, 4],
      state: {
        phase: "done",
        links: [
          link("head", HEAD, "fulfilled", { promiseState: "fulfilled", value: USER }),
          link("t1", THEN_ORDERS, "fulfilled", { promiseState: "fulfilled", value: ORDERS }),
          link("t2", THEN_ITEMS, "fulfilled", { promiseState: "fulfilled", value: ITEMS }),
          link("t3", THEN_LOG, "fulfilled", { promiseState: "fulfilled", value: "undefined" }),
        ],
        note: "Same three steps as Callback Hell: 7 lines and 3 levels there, 4 lines and 1 level here.",
      },
    },
  ];
}

function failsSteps(): ExecutionStep<PromisesStepState>[] {
  const withCatch = (
    t1: ChainLink,
    t2: ChainLink,
    t3: ChainLink,
    catchLink: ChainLink
  ): ChainLink[] => [
    link("head", HEAD, "fulfilled", { promiseState: "fulfilled", value: USER }),
    t1,
    t2,
    t3,
    catchLink,
  ];

  return [
    {
      id: "head",
      title: "The chain now ends with a .catch",
      description:
        "Same three steps as before, with one .catch on the end. There is no error parameter on any of the .then handlers.",
      whyExplanation:
        "In the Callback Hell lesson every level needed its own check. Here failure handling appears once, at the bottom.",
      activeCodeLines: [1, 5],
      state: {
        phase: "pending",
        links: [
          link("head", HEAD, "pending", { promiseState: "pending" }),
          link("t1", THEN_ORDERS, "waiting"),
          link("t2", THEN_ITEMS, "waiting"),
          link("t3", THEN_LOG, "waiting"),
          link("catch", CATCH, "waiting", { isCatch: true }),
        ],
      },
    },
    {
      id: "first-ok",
      title: "The first step succeeds",
      description: "getUser fulfils, so the first handler runs and calls getOrders — the chain is behaving normally.",
      activeCodeLines: [2],
      state: {
        phase: "handler-runs",
        links: withCatch(
          link("t1", THEN_ORDERS, "pending", { promiseState: "pending" }),
          link("t2", THEN_ITEMS, "waiting"),
          link("t3", THEN_LOG, "waiting"),
          link("catch", CATCH, "waiting", { isCatch: true })
        ),
      },
    },
    {
      id: "rejects",
      title: "getOrders rejects",
      description:
        "The promise it returned settles as rejected instead of fulfilled, so this link rejects too — carrying the reason rather than a value.",
      whyExplanation:
        "A rejection is the other half of settling. It travels along the chain the same way a value does, looking for something that will handle it.",
      activeCodeLines: [2],
      state: {
        phase: "rejected",
        rejectionInFlight: REASON,
        links: withCatch(
          link("t1", THEN_ORDERS, "rejected", { promiseState: "rejected", value: REASON }),
          link("t2", THEN_ITEMS, "waiting"),
          link("t3", THEN_LOG, "waiting"),
          link("catch", CATCH, "waiting", { isCatch: true })
        ),
      },
    },
    {
      id: "skip",
      title: "Both remaining .then handlers are skipped",
      description:
        "Lines 3 and 4 never run. A rejected promise has no value to hand them, so the rejection passes straight over them.",
      whyExplanation:
        "This is the behaviour that removes the per-level checks: handlers further down the chain do not have to ask whether something went wrong, because they simply are not called.",
      activeCodeLines: [3, 4],
      state: {
        phase: "rejected",
        rejectionInFlight: REASON,
        links: withCatch(
          link("t1", THEN_ORDERS, "rejected", { promiseState: "rejected", value: REASON }),
          link("t2", THEN_ITEMS, "skipped"),
          link("t3", THEN_LOG, "skipped"),
          link("catch", CATCH, "waiting", { isCatch: true })
        ),
      },
    },
    {
      id: "caught",
      title: "The .catch receives it",
      description: "The rejection reaches the first .catch in the chain, which runs with the error and logs the failure.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "fail-out", kind: "output", content: "Failed: No orders for user 1" }],
      state: {
        phase: "done",
        links: withCatch(
          link("t1", THEN_ORDERS, "rejected", { promiseState: "rejected", value: REASON }),
          link("t2", THEN_ITEMS, "skipped"),
          link("t3", THEN_LOG, "skipped"),
          link("catch", CATCH, "caught", { isCatch: true, value: REASON })
        ),
      },
    },
    {
      id: "one-handler",
      title: "One handler covered all three steps",
      description:
        "It did not matter which step failed. Had getUser or getItems rejected instead, the same .catch on line 5 would have caught it.",
      whyExplanation:
        "That is the single rejection path the previous lesson said Promises would bring: one place to handle failure, however long the chain gets.",
      activeCodeLines: [5],
      state: {
        phase: "done",
        links: withCatch(
          link("t1", THEN_ORDERS, "rejected", { promiseState: "rejected", value: REASON }),
          link("t2", THEN_ITEMS, "skipped"),
          link("t3", THEN_LOG, "skipped"),
          link("catch", CATCH, "caught", { isCatch: true, value: REASON })
        ),
        note: "Three steps, one error handler. Callback Hell needed one per level.",
      },
    },
  ];
}

export function buildInitialSteps({ scenario }: PromisesInputs): ExecutionStep<PromisesStepState>[] {
  if (scenario === "value") return valueSteps();
  if (scenario === "chain") return chainSteps();
  return failsSteps();
}
