import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { QueueItem } from "@/components/visualizers/TaskQueue";

/** The four walkthroughs the scenario picker offers. */
export type ScenarioId = "rule" | "drain" | "between" | "all-together";

export interface MicrotaskInputs {
  scenario: ScenarioId;
}

/**
 * One turn of the loop. These cycle rather than advance: after every task the
 * microtask queue is drained again, which is the part of the rule most people
 * get wrong — so the phase strip loops.
 */
export type QueuePhase =
  | "sync"
  | "stack-empties"
  | "draining"
  | "microtask-runs"
  | "taking-task"
  | "task-runs"
  | "done";

export interface MicrotaskStepState {
  phase: QueuePhase;
  callStack: CallStackFrame[];
  /** Sky chips. Promise handlers and queueMicrotask land here. */
  microtasks: QueueItem[];
  /** Violet chips. setTimeout callbacks land here. */
  taskQueue: QueueItem[];
  stackEmpty: boolean;
  /** True while the loop is emptying the microtask queue and the tasks wait. */
  drainingMicrotasks: boolean;
  /** One-line aside rendered under the queues. */
  note?: string;
}
