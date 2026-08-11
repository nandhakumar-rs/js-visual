import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { DebounceControls } from "./DebounceControls";
import { DebounceVisualization } from "./DebounceVisualization";
import type { DebounceInputs, DebounceStepState } from "./types";

export const debounceLab: LabDefinition<DebounceInputs, DebounceStepState> = {
  slug: "debounce",
  mode: "interactive",
  defaultInputs: { delayMs: 400 },
  getCode,
  buildInitialSteps,
  Controls: DebounceControls,
  Visualization: DebounceVisualization,
  challenge: {
    question:
      "You quickly type \"cat\" (3 keystrokes) into a search box debounced by 300ms, then stop typing. How many times does the debounced function actually run?",
    options: [
      { id: "0", label: "0" },
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
    ],
    correctOptionId: "1",
    explanation:
      "Each keystroke clears the previous timer and starts a new one. Only the last keystroke's timer ever gets to finish, so the debounced function runs exactly once, after typing stops.",
  },
  remember:
    "Debounce waits until activity stops before running the function — every new call resets the timer, so only the last call in a burst actually executes.",
};
