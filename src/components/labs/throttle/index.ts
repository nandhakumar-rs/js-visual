import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ThrottleControls } from "./ThrottleControls";
import { ThrottleVisualization } from "./ThrottleVisualization";
import type { ThrottleInputs, ThrottleStepState } from "./types";

export const throttleLab: LabDefinition<ThrottleInputs, ThrottleStepState> = {
  slug: "throttle",
  mode: "interactive",
  defaultInputs: { intervalMs: 800 },
  getCode,
  buildInitialSteps,
  Controls: ThrottleControls,
  Visualization: ThrottleVisualization,
  challenge: {
    question: "Which statement best describes the difference between debounce and throttle?",
    options: [
      { id: "a", label: 'Debounce: "wait until things stop." Throttle: "allow at most one call per interval."' },
      { id: "b", label: "They're the same thing with different names" },
      { id: "c", label: 'Debounce: "at most once per interval." Throttle: "wait until things stop."' },
    ],
    correctOptionId: "a",
    explanation:
      "Debounce delays until activity has stopped for a full pause window. Throttle instead guarantees a steady maximum rate — one call per interval — even while events keep arriving continuously.",
  },
  remember:
    'Throttle: "allow at most one call per interval," regardless of how many events arrive in between. Debounce: "wait until things stop" before calling at all.',
};
