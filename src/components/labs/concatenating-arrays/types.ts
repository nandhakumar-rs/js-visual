export type ConcatMode = "concat" | "spread";

export interface ConcatArraysInputs {
  a: number[];
  b: number[];
  mode: ConcatMode;
}

export interface ConcatArraysStepState {
  a: number[];
  b: number[];
  result?: number[];
}
