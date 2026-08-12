export type RangeDirection = "up" | "down";
export type RangeLineStatus = "pending" | "included" | "excluded";

export interface RangeLineItem {
  value: number;
  status: RangeLineStatus;
  isBoundary?: boolean;
}

export interface RangeInputs {
  start: number;
  end: number;
  step: number;
}

export interface RangeStepState {
  line: RangeLineItem[];
  result: number[];
  currentValue: number | null;
  boundaryCheck: { expression: string; result: boolean } | null;
  isFinal: boolean;
  direction: RangeDirection;
  capped: boolean;
}
