import type { ExecutionStep } from "@/lib/execution/types";
import type { XhrInputs, XhrStepState } from "./types";

const TOTAL_MS = 1200;

export function buildInitialSteps({ willSucceed }: XhrInputs): ExecutionStep<XhrStepState>[] {
  const steps: ExecutionStep<XhrStepState>[] = [
    {
      id: "create",
      title: "new XMLHttpRequest()",
      description: "A new XHR object is created, ready to be configured.",
      activeCodeLines: [1],
      durationMs: 500,
      state: { stage: "created", elapsedMs: 0, totalMs: TOTAL_MS },
    },
    {
      id: "open",
      title: 'xhr.open("GET", "/users")',
      description: "The request method and URL are configured, but nothing has been sent yet.",
      activeCodeLines: [2],
      durationMs: 500,
      state: { stage: "opened", elapsedMs: 0, totalMs: TOTAL_MS },
    },
  ];

  const ticks = 4;
  for (let i = 1; i <= ticks; i++) {
    steps.push({
      id: `travel-${i}`,
      title: "Request travelling...",
      description: "The request is in flight, out on the network.",
      activeCodeLines: [12],
      durationMs: TOTAL_MS / ticks,
      state: { stage: "sending", elapsedMs: (TOTAL_MS / ticks) * i, totalMs: TOTAL_MS },
    });
  }

  steps.push({
    id: "done",
    title: willSucceed ? "onload fires" : "onerror fires",
    description: willSucceed
      ? "The response arrives, readyState becomes DONE, and the onload handler runs."
      : "The request fails, and the onerror handler runs instead of onload.",
    whyExplanation:
      "XHR reports progress through readystatechange events and dedicated onload/onerror callbacks — a more manual, event-driven lifecycle than fetch()'s Promise-based one.",
    activeCodeLines: willSucceed ? [4, 5] : [8, 9],
    consoleOutput: [
      willSucceed
        ? { id: "log-1", kind: "output", content: '{ users: [...] }' }
        : { id: "log-1", kind: "error", content: "Request failed" },
    ],
    state: { stage: "done", elapsedMs: TOTAL_MS, totalMs: TOTAL_MS, succeeded: willSucceed },
  });

  return steps;
}
