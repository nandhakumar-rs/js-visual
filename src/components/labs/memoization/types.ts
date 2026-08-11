export type MemoizationInputs = Record<string, never>;

export interface CacheEntry {
  input: number;
  result: number;
}

export interface MemoizationStepState {
  cache: CacheEntry[];
  calls: number;
  calculations: number;
  cacheHits: number;
  lastInput?: number;
  wasHit?: boolean;
}
