export type ClosuresInputs = Record<string, never>;

export interface CounterState {
  id: string;
  label: string;
  count: number;
  previousCount?: number;
}

export interface ClosuresStepState {
  counters: CounterState[];
  activeCounterId?: string;
}
