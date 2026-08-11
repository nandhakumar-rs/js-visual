export type SortMode = "default" | "numeric" | "immutable";

export interface SortingInputs {
  array: number[];
  mode: SortMode;
}

export interface SortingStepState {
  numbers: number[];
  sorted?: number[];
  compareIndices?: [number, number];
  swapped?: boolean;
}
