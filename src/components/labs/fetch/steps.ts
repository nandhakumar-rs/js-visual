import type { ExecutionStep } from "@/lib/execution/types";
import type { FetchInputs, FetchStepState } from "./types";

export function buildInitialSteps({ willSucceed }: FetchInputs): ExecutionStep<FetchStepState>[] {
  const base: ExecutionStep<FetchStepState>[] = [
    {
      id: "call",
      title: 'fetch("/users") called',
      description: "fetch() immediately returns a pending Promise and starts the request in the background.",
      whyExplanation: "Calling fetch() doesn't wait for anything — it hands back a Promise right away, in the 'pending' state.",
      activeCodeLines: [1],
      durationMs: 700,
      state: {
        promiseState: "pending",
        callStack: [{ id: "main", label: "main()", isActive: true }],
        microtasks: [],
        loopActive: false,
      },
    },
    {
      id: "settle",
      title: willSucceed ? "Response arrives — Promise fulfills" : "Request fails — Promise rejects",
      description: willSucceed
        ? "The network request completes, and the fetch() Promise moves from pending to fulfilled."
        : "The network request fails, and the fetch() Promise moves from pending to rejected.",
      activeCodeLines: [1],
      durationMs: 900,
      state: {
        promiseState: willSucceed ? "fulfilled" : "rejected",
        callStack: [{ id: "main", label: "main()", isActive: true }],
        microtasks: [],
        loopActive: false,
      },
    },
  ];

  const successSteps: ExecutionStep<FetchStepState>[] = [
    {
      id: "then1",
      title: ".then(response => response.json()) queued",
      description:
        "The fulfilled handler is queued rather than called on the spot — it runs once the current synchronous code has finished.",
      activeCodeLines: [2],
      state: {
        promiseState: "fulfilled",
        callStack: [],
        microtasks: [{ id: "then1", label: "response.json()" }],
        loopActive: true,
      },
    },
    {
      id: "then2",
      title: ".then(users => console.log(users)) runs",
      description: "The parsed JSON flows into the next .then, which logs it.",
      activeCodeLines: [3],
      consoleOutput: [{ id: "log-1", kind: "output", content: '[{ name: "Maya" }, { name: "Alex" }]' }],
      state: {
        promiseState: "fulfilled",
        callStack: [],
        microtasks: [{ id: "then2", label: "console.log(users)" }],
        loopActive: true,
      },
    },
  ];

  const failureSteps: ExecutionStep<FetchStepState>[] = [
    {
      id: "catch",
      title: ".catch(error => console.error(error)) runs",
      description: "Because the Promise rejected, every .then is skipped and control jumps straight to .catch.",
      whyExplanation:
        "A rejected Promise skips remaining .then handlers and is instead caught by the nearest .catch.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "log-1", kind: "error", content: "TypeError: Failed to fetch" }],
      state: {
        promiseState: "rejected",
        callStack: [],
        microtasks: [{ id: "catch", label: "console.error(error)" }],
        loopActive: true,
      },
    },
  ];

  return [...base, ...(willSucceed ? successSteps : failureSteps)];
}
