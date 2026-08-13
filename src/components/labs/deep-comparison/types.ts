import type { CallStackFrame } from "@/components/visualizers/CallStack";

/** The four walkthroughs the scenario picker offers. */
export type ScenarioId = "shallow-vs-deep" | "walk" | "mismatch" | "all-together";

export interface DeepComparisonInputs {
  scenario: ScenarioId;
}

/**
 * One move of the recursion. These cycle: the same three moves happen at every
 * level of the tree, which is what makes recursion the right tool — the same
 * cycling treatment the Callback Hell and async lessons use.
 */
export type WalkPhase = "comparing" | "descending" | "returning" | "short-circuit" | "done";

export type NodeStatus =
  /** Not reached yet. */
  | "pending"
  /** The pair currently being compared. */
  | "visiting"
  | "match"
  | "mismatch"
  /** Never visited — the walk short-circuited before reaching it. */
  | "skipped";

/**
 * One node of the two objects drawn as a single merged tree: one row per pair
 * of values at the same path.
 *
 * Held as a flat list with an explicit `depth` rather than a nested structure,
 * so a step's state stays a plain array and indentation is a render concern.
 */
export interface TreeNode {
  id: string;
  /** Property path, e.g. "address.city". The root uses "(root)". */
  path: string;
  depth: number;
  /** The value on each side, already formatted for display. */
  left: string;
  right: string;
  status: NodeStatus;
}

export interface DeepComparisonStepState {
  phase: WalkPhase;
  nodes: TreeNode[];
  callStack: CallStackFrame[];
  /** One per call to deepEqual — the number the complexity argument rests on. */
  comparisons: number;
  result?: boolean;
  /** One-line aside rendered below the tree. */
  note?: string;
}
