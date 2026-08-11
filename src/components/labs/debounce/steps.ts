import type { ExecutionStep } from "@/lib/execution/types";
import type { DebounceStepState } from "./types";

export function buildInitialSteps(): ExecutionStep<DebounceStepState>[] {
  return [
    {
      id: "seed",
      title: "Waiting for input",
      description: 'Type in the search box to trigger keystroke events.',
      whyExplanation: "No timer is running yet — nothing has been typed.",
      activeCodeLines: [],
      state: { keystrokes: 0, rawCalls: 0, debouncedCalls: 0, timerStatus: "idle", lastValue: "" },
    },
  ];
}
