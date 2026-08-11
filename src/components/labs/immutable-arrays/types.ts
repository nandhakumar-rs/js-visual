export type MutationMode = "push" | "spread";

export interface ImmutableArrayInputs {
  newValue: number;
  mode: MutationMode;
}

export type ImmutableArrayPhase = "push-seed" | "push-done" | "spread-seed" | "spread-done";

export interface ImmutableArrayStepState {
  phase: ImmutableArrayPhase;
  array: number[];
  original: number[];
  updated?: number[];
}
