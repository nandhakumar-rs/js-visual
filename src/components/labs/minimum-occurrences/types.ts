export interface MinOccurrencesInputs {
  array: number[];
}

export interface MinOccurrencesStepState {
  stage: "scanning" | "min-found" | "counting" | "done";
  activeIndex?: number;
  currentMin?: number;
  matchIndices: number[];
  min?: number;
  occurrences?: number;
}
