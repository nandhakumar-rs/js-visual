export interface RangeInputs {
  start: number;
  end: number;
  step: number;
}

export interface RangeStepState {
  result: number[];
  current?: number;
}
