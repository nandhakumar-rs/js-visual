import type { ExecutionStep } from "@/lib/execution/types";
import type { PromiseAllInputs, PromiseAllStepState } from "./types";

const USERS = [{ name: "Maya" }, { name: "Alex" }];
const STATUSES = [true, false];

export function buildInitialSteps({ statusesFail }: PromiseAllInputs): ExecutionStep<PromiseAllStepState>[] {
  const seed: ExecutionStep<PromiseAllStepState> = {
    id: "seed",
    title: "Both requests start together",
    description: "getUsers() and getStatuses() both start immediately — Promise.all doesn't wait between them.",
    activeCodeLines: [0, 1, 2, 3],
    durationMs: 700,
    state: {
      requests: [
        { id: "users", label: "getUsers()", status: "pending" },
        { id: "statuses", label: "getStatuses()", status: "pending" },
      ],
      allState: "pending",
    },
  };

  const usersResolve: ExecutionStep<PromiseAllStepState> = {
    id: "users-resolve",
    title: "getUsers() resolves",
    description: "The users request finishes first.",
    activeCodeLines: [1],
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
        activeCodeLines: [2],
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
        id: "all-rejects",
        title: "Promise.all() rejects immediately",
        description: "Even though getUsers() succeeded, Promise.all() rejects as a whole the instant ANY of its promises rejects.",
        whyExplanation:
          "Promise.all() is all-or-nothing: it fulfills only if every promise fulfills. The moment one rejects, Promise.all() immediately rejects with that same reason — the successful getUsers() result is simply discarded.",
        activeCodeLines: [0],
        consoleOutput: [{ id: "log-1", kind: "error", content: "Uncaught (in promise) Error: Failed to load statuses" }],
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

  const statusesResolve: ExecutionStep<PromiseAllStepState> = {
    id: "statuses-resolve",
    title: "getStatuses() resolves",
    description: "Both requests have now settled successfully.",
    activeCodeLines: [2],
    state: {
      requests: [
        { id: "users", label: "getUsers()", status: "fulfilled" },
        { id: "statuses", label: "getStatuses()", status: "fulfilled" },
      ],
      allState: "fulfilled",
    },
  };

  const combined = USERS.map((user, i) => ({ name: user.name, active: STATUSES[i] }));

  const mapStep: ExecutionStep<PromiseAllStepState> = {
    id: "map",
    title: "users.map(...) combines the results",
    description: "Both arrays are now available, so they can be zipped together by index.",
    activeCodeLines: [5, 6, 7, 8],
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
