export type MutationMode = "push" | "spread";

export interface ImmutableArrayInputs {
  mode: MutationMode;
  newValue: number;
}

export interface ImmutableArrayStepState {
  array: number[];
  newArray?: number[];
  sameReference: boolean;
}
