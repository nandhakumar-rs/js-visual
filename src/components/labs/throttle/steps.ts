import type { ExecutionStep } from "@/lib/execution/types";
import type { ThrottleStepState } from "./types";

export function buildInitialSteps(): ExecutionStep<ThrottleStepState>[] {
  return [
    {
      id: "seed",
      title: "Waiting for events",
      description: 'Click "Trigger Event" (rapidly, a few times) to see throttling in action.',
      whyExplanation: "isBlocked starts false, so the very first event will always go through immediately.",
      activeCodeLines: [],
      state: { events: 0, calls: 0, blocked: 0, wasBlocked: false },
    },
  ];
}
