export type SortMode = "default" | "asc" | "desc" | "immutable";

export interface SortingInputs {
  values: number[];
  mode: SortMode;
}

export interface SortingComparison {
  a: number;
  b: number;
  result: number;
}

export interface SortingStepState {
  numbers: number[];
  sorted: number[] | null;
  compareValues: string[] | null;
  comparisons: SortingComparison[] | null;
  isFinal: boolean;
}
