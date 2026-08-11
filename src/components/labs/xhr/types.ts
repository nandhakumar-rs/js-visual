export interface XhrInputs {
  willSucceed: boolean;
}

export interface XhrStepState {
  stage: "idle" | "created" | "opened" | "sending" | "done";
  elapsedMs: number;
  totalMs: number;
  succeeded?: boolean;
}
