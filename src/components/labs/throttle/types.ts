export interface ThrottleInputs {
  intervalMs: number;
}

export interface ThrottleStepState {
  events: number;
  calls: number;
  blocked: number;
  wasBlocked: boolean;
}
