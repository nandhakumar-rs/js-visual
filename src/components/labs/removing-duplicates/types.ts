export type DedupMethod = "set" | "filter" | "reduce";

export interface DedupInputs {
  array: number[];
  method: DedupMethod;
}

export interface DedupStepState {
  visitedIndex: number;
  seen: number[];
  isDuplicate: boolean;
}
