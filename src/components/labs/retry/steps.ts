import type { ExecutionStep } from "@/lib/execution/types";
import type { RetryInputs, RetryStepState } from "./types";

export function buildInitialSteps({
  failuresBeforeSuccess,
  maxRetries,
  retryDelayMs,
  exponentialBackoff,
}: RetryInputs): ExecutionStep<RetryStepState>[] {
  const steps: ExecutionStep<RetryStepState>[] = [];
  const attempts: RetryStepState["attempts"] = [];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const willSucceed = attempt > failuresBeforeSuccess;

    steps.push({
      id: `attempt-${attempt}`,
      title: `Attempt #${attempt}`,
      description: willSucceed ? `Attempt #${attempt} succeeds.` : `Attempt #${attempt} fails.`,
      activeCodeLines: [3],
      durationMs: 500,
      state: { attempts: [...attempts, { n: attempt, status: willSucceed ? "success" : "failed" }] },
    });
    attempts.push({ n: attempt, status: willSucceed ? "success" : "failed" });

    if (willSucceed) {
      steps.push({
        id: "done",
        title: "Success",
        description: `fetchWithRetry() resolves after ${attempt} attempt${attempt === 1 ? "" : "s"}.`,
        activeCodeLines: [3],
        consoleOutput: [{ id: "log-1", kind: "output", content: `Succeeded on attempt #${attempt}` }],
        state: { attempts: [...attempts] },
      });
      return steps;
    }

    if (attempt === maxRetries) {
      steps.push({
        id: "gave-up",
        title: "Out of retries",
        description: `maxRetries (${maxRetries}) reached — the error is finally thrown.`,
        whyExplanation: "A retry loop only helps with transient failures. Once the retry budget is exhausted, the underlying error propagates to the caller.",
        activeCodeLines: [5],
        consoleOutput: [{ id: "log-1", kind: "error", content: "Error: All retry attempts failed" }],
        state: { attempts: [...attempts.slice(0, -1), { n: attempt, status: "gave-up" }] },
      });
      return steps;
    }

    const delay = exponentialBackoff ? retryDelayMs * 2 ** (attempt - 1) : retryDelayMs;
    steps.push({
      id: `wait-${attempt}`,
      title: `Wait ${delay}ms`,
      description: exponentialBackoff
        ? `Exponential backoff: delay doubles each retry (${retryDelayMs}ms × 2^${attempt - 1} = ${delay}ms).`
        : `Wait a fixed ${delay}ms before trying again.`,
      activeCodeLines: [6],
      durationMs: Math.min(delay, 1200),
      state: { attempts: [...attempts], waitingMs: delay },
    });
  }

  return steps;
}
