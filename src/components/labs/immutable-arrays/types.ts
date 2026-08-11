export type MutationMode = "both" | "push" | "spread";

export interface ImmutableArrayInputs {
  newValue: number;
  // "both" is the initial-teaching sentinel (shows the full push+spread
  // comparison); Try It Yourself only ever sets this to "push" or "spread".
  mode: MutationMode;
}

export type ImmutableArrayPhase = "push-seed" | "push-done" | "spread-seed" | "spread-done" | "comparison";

export interface ImmutableArrayStepState {
  phase: ImmutableArrayPhase;
  array: number[];
  original: number[];
  updated?: number[];
}
