export type DedupMethod = "set" | "filter" | "reduce";

export type DedupItemStatus = "waiting" | "checking" | "kept" | "skipped";

export interface DedupInputs {
  values: number[];
  method: DedupMethod;
}

export interface DedupStepState {
  itemStatuses: DedupItemStatus[];
  resultValues: number[];
  isFinal: boolean;
  /** Index currently being checked, or -1 on the "ready"/"done" steps. */
  currentIndex: number;
  /** Whether the value at `currentIndex` was already present before this step. Meaningful only when `currentIndex !== -1`. */
  currentIsDuplicate: boolean;
}
