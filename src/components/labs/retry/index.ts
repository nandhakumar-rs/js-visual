import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { RetryControls } from "./RetryControls";
import { RetryVisualization } from "./RetryVisualization";
import type { RetryInputs, RetryStepState } from "./types";

export const retryLab: LabDefinition<RetryInputs, RetryStepState> = {
  slug: "retry",
  mode: "scripted",
  defaultInputs: { failuresBeforeSuccess: 2, maxRetries: 3, retryDelayMs: 500, exponentialBackoff: false },
  getCode,
  buildInitialSteps,
  Controls: RetryControls,
  Visualization: RetryVisualization,
  challenge: {
    question: "With maxRetries = 3 and failuresBeforeSuccess = 5, what happens?",
    options: [
      { id: "a", label: "It eventually succeeds on attempt 4" },
      { id: "b", label: "It gives up after 3 attempts and throws" },
      { id: "c", label: "It retries forever" },
    ],
    correctOptionId: "b",
    explanation:
      "The retry budget is capped at maxRetries. Since success only happens after attempt 5 but the loop stops at attempt 3, it exhausts its retries and throws the last error.",
  },
  remember:
    "A retry wrapper catches a failure, waits (optionally with exponential backoff — doubling the delay each time), and tries again up to a maximum count before finally giving up and throwing.",
};
