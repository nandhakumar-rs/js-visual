export interface DebounceInputs {
  delayMs: number;
}

export type TimerStatus = "idle" | "running" | "fired";

export interface DebounceStepState {
  keystrokes: number;
  rawCalls: number;
  debouncedCalls: number;
  timerStatus: TimerStatus;
  lastValue: string;
}
