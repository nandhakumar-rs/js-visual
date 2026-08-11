export type ShuffleMode = "fisher-yates" | "flawed-sort";

export interface ShuffleInputs {
  items: string[];
  mode: ShuffleMode;
  shuffleTrigger: number;
}

export interface ShuffleStepState {
  items: string[];
  swapIndices?: [number, number];
}
