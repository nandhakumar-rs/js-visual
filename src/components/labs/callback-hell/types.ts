/** The three walkthroughs the scenario picker offers. */
export type ScenarioId = "two-steps" | "four-steps" | "fails";

export interface CallbackHellInputs {
  scenario: ScenarioId;
}

/**
 * The three-beat loop that produces one level of nesting. It repeats once per
 * step, which is why the phase strip cycles rather than advancing linearly —
 * the repetition is the thing being taught.
 */
export type HellPhase = "calling" | "result-arrives" | "nesting-deeper" | "done" | "failed";

export type StepStatus = "waiting" | "running" | "done" | "failed" | "never-ran";

export interface PipelineStep {
  id: string;
  /** The call as written, e.g. "getOrders(user.id, ...)". */
  label: string;
  /** Nesting level, 1-based. Equal to the step's position in the chain. */
  depth: number;
  status: StepStatus;
  /** What this step handed to the next one. */
  produced?: { name: string; displayValue: string };
  /** This level carries its own `if (error)` check. */
  hasErrorCheck?: boolean;
  /** The check on this level is the one that fired. */
  errorCaught?: boolean;
}

export interface CallbackHellStepState {
  phase: HellPhase;
  /** Ordered outermost-first; the visualization nests them by that order. */
  steps: PipelineStep[];
  /** Deepest level reached so far — the headline number. */
  depth: number;
  /** How many copies of the same error check the code contains. */
  errorChecks?: number;
  /** One-line aside rendered under the cards. */
  note?: string;
}
