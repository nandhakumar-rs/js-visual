import type { ExecutionStep } from "@/lib/execution/types";
import type { AsyncAwaitInputs, AsyncAwaitStepState } from "./types";

const USERS = [{ name: "Maya" }, { name: "Alex" }];
const STATUSES = [true, false];

export function buildInitialSteps({ statusesFail, style }: AsyncAwaitInputs): ExecutionStep<AsyncAwaitStepState>[] {
  const isAsync = style === "async-await";
  const startLines = isAsync ? [1, 2, 3, 4] : [0];
  const settleLine = isAsync ? 1 : 0;
  const mapLines = isAsync ? [6, 7, 8, 9, 11] : [2, 3, 4, 5, 6];
  const catchLine = isAsync ? 13 : 8;

  const seed: ExecutionStep<AsyncAwaitStepState> = {
    id: "seed",
    title: "Both requests start together",
    description: isAsync
      ? "await pauses THIS function at this line — but it does not block the JavaScript thread. Other code can still run while these requests are in flight."
      : "Promise.all() starts getUsers() and getStatuses() concurrently.",
    whyExplanation: isAsync
      ? "async/await is syntactic sugar over Promises. 'Pausing' only pauses the async function itself; the rest of the program (and the browser) keeps running normally."
      : undefined,
    activeCodeLines: startLines,
    durationMs: 700,
    state: {
      requests: [
        { id: "users", label: "getUsers()", status: "pending" },
        { id: "statuses", label: "getStatuses()", status: "pending" },
      ],
      allState: "pending",
    },
  };

  const usersResolve: ExecutionStep<AsyncAwaitStepState> = {
    id: "users-resolve",
    title: "getUsers() resolves",
    description: "The users request finishes first.",
    activeCodeLines: [settleLine],
    state: {
      requests: [
        { id: "users", label: "getUsers()", status: "fulfilled" },
        { id: "statuses", label: "getStatuses()", status: "pending" },
      ],
      allState: "pending",
    },
  };

  if (statusesFail) {
    return [
      seed,
      usersResolve,
      {
        id: "statuses-reject",
        title: "getStatuses() rejects",
        description: "The statuses request fails with an error.",
        activeCodeLines: [settleLine],
        state: {
          requests: [
            { id: "users", label: "getUsers()", status: "fulfilled" },
            { id: "statuses", label: "getStatuses()", status: "rejected" },
          ],
          allState: "rejected",
          errorMessage: "Error: Failed to load statuses",
        },
      },
      {
        id: "catch",
        title: isAsync ? "catch (error) block runs" : ".catch(error => ...) runs",
        description: isAsync
          ? "The rejection is thrown at the await line, and control jumps straight to the catch block."
          : "Promise.all() rejects, so .then() is skipped and .catch() runs instead.",
        whyExplanation:
          "Promise.all() is all-or-nothing: the moment one input rejects, the whole thing rejects — the successful getUsers() result is discarded either way.",
        activeCodeLines: [catchLine],
        consoleOutput: [{ id: "log-1", kind: "error", content: "Error: Failed to load statuses" }],
        state: {
          requests: [
            { id: "users", label: "getUsers()", status: "fulfilled" },
            { id: "statuses", label: "getStatuses()", status: "rejected" },
          ],
          allState: "rejected",
          errorMessage: "Error: Failed to load statuses",
        },
      },
    ];
  }

  const statusesResolve: ExecutionStep<AsyncAwaitStepState> = {
    id: "statuses-resolve",
    title: "getStatuses() resolves",
    description: isAsync
      ? "Both promises have settled, so await hands control back to this function, resuming right where it left off."
      : "Both requests have now settled successfully.",
    activeCodeLines: [settleLine],
    state: {
      requests: [
        { id: "users", label: "getUsers()", status: "fulfilled" },
        { id: "statuses", label: "getStatuses()", status: "fulfilled" },
      ],
      allState: "fulfilled",
    },
  };

  const combined = USERS.map((user, i) => ({ name: user.name, active: STATUSES[i] }));

  const mapStep: ExecutionStep<AsyncAwaitStepState> = {
    id: "map",
    title: "users.map(...) combines the results",
    description: "Both arrays are now available, so they can be zipped together by index.",
    activeCodeLines: mapLines,
    consoleOutput: [{ id: "log-1", kind: "output", content: JSON.stringify(combined) }],
    state: {
      requests: [
        { id: "users", label: "getUsers()", status: "fulfilled" },
        { id: "statuses", label: "getStatuses()", status: "fulfilled" },
      ],
      allState: "fulfilled",
      combined,
    },
  };

  return [seed, usersResolve, statusesResolve, mapStep];
}
