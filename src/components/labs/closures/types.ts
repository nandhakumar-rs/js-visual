import type { VariableStatus } from "@/components/visualizers/VariableBox";

/** The three walkthroughs the scenario picker offers. */
export type ScenarioId = "one-counter" | "two-counters" | "from-outside";

export interface ClosuresInputs {
  scenario: ScenarioId;
}

/**
 * Where execution is relative to the call that created the closure. The
 * lesson turns on the middle one: `call-finished` is the moment the scope
 * would normally be discarded, and isn't.
 */
export type ClosurePhase = "before-call" | "call-running" | "call-finished" | "using-closure";

/**
 * What is happening to one retained scope right now. `unreachable` is not a
 * failure of the closure — it is the closure working: the variable is kept
 * alive *and* kept private.
 */
export type ClosureStatus = "creating" | "retained" | "updating" | "unreachable";

/** Same shape scope/types.ts uses, so both lessons feed ScopeBox identically. */
export interface ClosureVarEntry {
  name: string;
  displayValue: string;
  status: VariableStatus;
}

export interface ClosureBox {
  /** Matches the global binding that holds the returned function, e.g. "counterA". */
  id: string;
  label: string;
  count: number;
  /** Drives VariableBox's strikethrough transition when the count changes. */
  previousCount?: number;
  status: ClosureStatus;
}

export interface ClosuresStepState {
  phase: ClosurePhase;
  globalVars: ClosureVarEntry[];
  /** True only while createCounter() is still on the stack. */
  factoryOpen: boolean;
  factoryVars: ClosureVarEntry[];
  closures: ClosureBox[];
  activeClosureId?: string;
  /** Set only on the from-outside scenario's final step. */
  failedRead?: { variable: string; searched: string[] };
}
