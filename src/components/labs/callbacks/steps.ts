import type { ExecutionStep } from "@/lib/execution/types";
import type { CallbacksInputs, CallbacksStepState } from "./types";

export function buildInitialSteps({ delayMs }: CallbacksInputs): ExecutionStep<CallbacksStepState>[] {
  return [
    {
      id: "call",
      title: "getUser(1, callback) called",
      description: "getUser runs, immediately calling setTimeout and then returning — it doesn't wait around.",
      activeCodeLines: [1, 2, 3, 4, 5],
      state: {
        callStack: [{ id: "main", label: "main()" }, { id: "getUser", label: "getUser()", isActive: true }],
        webApis: [],
        macrotasks: [],
        loopActive: false,
      },
    },
    {
      id: "schedule",
      title: "setTimeout hands the timer to the browser",
      description: `The browser (not JavaScript) counts down ${delayMs}ms in the background. getUser() has already returned.`,
      whyExplanation: "setTimeout is a Web API — the actual waiting happens outside the JS engine, freeing it up to run other code.",
      activeCodeLines: [2],
      durationMs: Math.min(delayMs, 1500),
      state: {
        callStack: [{ id: "main", label: "main()" }],
        webApis: [{ id: "timer", label: `setTimeout (${delayMs}ms)` }],
        macrotasks: [],
        loopActive: false,
      },
    },
    {
      id: "timer-done",
      title: "Timer completes",
      description: "The callback moves from the Web API into the task queue, waiting for the call stack to be empty.",
      activeCodeLines: [2],
      state: {
        callStack: [],
        webApis: [],
        macrotasks: [{ id: "cb", label: "() => callback({...})" }],
        loopActive: true,
      },
    },
    {
      id: "callback",
      title: "callback(user) runs",
      description: "The call stack is empty, so the event loop pushes the callback onto it and runs console.log.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "log-1", kind: "output", content: '{ id: 1, name: "Maya" }' }],
      state: {
        callStack: [{ id: "cb", label: "callback()", isActive: true }],
        webApis: [],
        macrotasks: [],
        loopActive: false,
      },
    },
  ];
}
