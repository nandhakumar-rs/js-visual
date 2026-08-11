export interface RetryInputs {
  failuresBeforeSuccess: number;
  maxRetries: number;
  retryDelayMs: number;
  exponentialBackoff: boolean;
}

export interface RetryAttempt {
  n: number;
  status: "failed" | "success" | "gave-up";
}

export interface RetryStepState {
  attempts: RetryAttempt[];
  waitingMs?: number;
}
