import type { ObjectEntry } from "@/components/visualizers/ObjectVisualizer";

/** The four walkthroughs the scenario picker offers. */
export type ScenarioId = "look-alikes" | "shallow" | "nested" | "all-together";

export interface ShallowComparisonInputs {
  scenario: ScenarioId;
}

/**
 * A check that runs once to a verdict — so unlike the async lessons' strips,
 * this one advances rather than cycling.
 */
export type EqualityPhase = "bindings" | "comparing" | "nested-check" | "verdict" | "done";

/**
 * One object as it exists in memory. `tag` is what makes this lesson possible
 * at all: without a visible identity, two look-alike objects are indistinguishable
 * on screen, which is exactly the learner's misconception.
 */
export interface HeapObject {
  id: string;
  tag: string;
  entries: ObjectEntry[];
  /** Highlighted while it is the object being compared. */
  isActive?: boolean;
}

/** A name, and which object it leads to. Several names can share one target. */
export interface Binding {
  name: string;
  target: string;
}

/** One evaluated comparison, accumulating down the steps alongside the console. */
export interface Comparison {
  id: string;
  /** The expression as written, e.g. `a === b`. */
  label: string;
  result: boolean;
  /** Short reason, shown under the row. */
  note?: string;
}

export interface ShallowComparisonStepState {
  phase: EqualityPhase;
  objects: HeapObject[];
  bindings: Binding[];
  comparisons: Comparison[];
  /** One-line aside rendered below the comparisons. */
  note?: string;
}
