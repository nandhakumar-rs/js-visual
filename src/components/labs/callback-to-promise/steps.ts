import type { ExecutionStep } from "@/lib/execution/types";
import type { CallbackToPromiseInputs, CallbackToPromiseStepState } from "./types";

export function buildInitialSteps({
  style,
}: CallbackToPromiseInputs): ExecutionStep<CallbackToPromiseStepState>[] {
  const isPromise = style === "promise";

  const callStep: ExecutionStep<CallbackToPromiseStepState> = {
    id: "call",
    title: "getUser(1) called",
    description: isPromise
      ? "getUser now returns a Promise object immediately — pending, representing a result that will arrive later."
      : "getUser starts the timer and returns undefined — the result will only ever reach you through the callback.",
    whyExplanation: isPromise
      ? "Wrapping the callback-based work in `new Promise(...)` gives the caller an actual object to hold onto, instead of just a callback contract."
      : undefined,
    activeCodeLines: isPromise ? [0, 1] : [0],
    state: {
      callStack: [{ id: "main", label: "main()" }, { id: "getUser", label: "getUser()", isActive: true }],
      webApis: [],
      promiseState: isPromise ? "pending" : undefined,
    },
  };

  const scheduleStep: ExecutionStep<CallbackToPromiseStepState> = {
    id: "schedule",
    title: "setTimeout scheduled",
    description: "The 800ms timer is handed off to the browser; getUser() has already returned.",
    activeCodeLines: isPromise ? [2] : [1],
    durationMs: 800,
    state: {
      callStack: [{ id: "main", label: "main()" }],
      webApis: [{ id: "timer", label: "setTimeout (800ms)" }],
      promiseState: isPromise ? "pending" : undefined,
    },
  };

  const settleStep: ExecutionStep<CallbackToPromiseStepState> = isPromise
    ? {
        id: "resolve",
        title: "resolve(user) is called",
        description: "Calling resolve() moves the Promise from pending to fulfilled, unlocking any .then() callbacks.",
        whyExplanation: "resolve() and reject() are the two functions that settle a Promise — a callback-based API has no equivalent single settling point.",
        activeCodeLines: [3],
        state: {
          callStack: [],
          webApis: [],
          promiseState: "fulfilled",
        },
      }
    : {
        id: "invoke",
        title: "callback(null, user) is called",
        description: "The timer fires and directly invokes the callback function that was passed in.",
        activeCodeLines: [2],
        state: {
          callStack: [{ id: "cb", label: "callback()", isActive: true }],
          webApis: [],
        },
      };

  const resultStep: ExecutionStep<CallbackToPromiseStepState> = {
    id: "result",
    title: isPromise ? ".then(user => console.log(user)) runs" : "console.log(user) runs",
    description: isPromise
      ? "The fulfilled Promise's .then() handler runs as a microtask, receiving the resolved value."
      : "Inside the callback, the result is logged directly.",
    activeCodeLines: isPromise ? [8] : [7],
    consoleOutput: [{ id: "log-1", kind: "output", content: '{ id: 1, name: "Maya" }' }],
    state: {
      callStack: [],
      webApis: [],
      promiseState: isPromise ? "fulfilled" : undefined,
      result: '{ id: 1, name: "Maya" }',
    },
  };

  return [callStep, scheduleStep, settleStep, resultStep];
}
