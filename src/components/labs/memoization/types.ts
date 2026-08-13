/** The four walkthroughs the scenario picker offers. */
export type ScenarioId = "hit-and-miss" | "the-key" | "when-it-hurts" | "all-together";

export interface MemoizationInputs {
  scenario: ScenarioId;
}

/**
 * One call's trip through the cache. These cycle: every call repeats the same
 * three moves, which is the same reason the async lessons cycle their strips.
 */
export type CallPhase =
  | "calling"
  | "looking"
  | "hit"
  | "miss"
  /** The cache answered, and the answer is wrong — stale, or a key collision. */
  | "bad-hit"
  | "done";

export type EntryStatus =
  /** Sitting in the cache, untouched this step. */
  | "stored"
  /** Written this step. */
  | "added"
  /** Read this step. */
  | "hit"
  /** Read this step, and it should not have been. */
  | "bad";

export interface CacheRow {
  id: string;
  /**
   * The key exactly as the cache holds it — `2` for a number, `#1` for an
   * object identity, the literal `[{}]` string for a stringified key. Showing
   * the real key is what makes both failure modes visible rather than asserted.
   */
  key: string;
  value: string;
  status: EntryStatus;
}

export interface MemoizationStepState {
  phase: CallPhase;
  entries: CacheRow[];
  /** Calls completed. Always equals calculations + hits. */
  calls: number;
  calculations: number;
  hits: number;
  /** Which cache the table is showing, when a scenario uses more than one. */
  cacheLabel?: string;
  /** Rows beyond those listed, for scenarios with a cache too big to draw. */
  hiddenEntries?: number;
  /** One-line aside rendered below the counters. */
  note?: string;
}
