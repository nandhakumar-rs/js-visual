export interface CurryingInputs {
  a: number;
  b: number;
}

export interface CurryingStepState {
  stage: "idle" | "outer" | "inner" | "done";
  a?: number;
  b?: number;
  result?: number;
}
