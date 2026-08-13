import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { PromiseState } from "@/components/visualizers/PromiseNode";
import type { QueueItem } from "@/components/visualizers/TaskQueue";
import type { VariableEntry } from "@/components/visualizers/ScopeBox";

/** The four walkthroughs the scenario picker offers. */
export type ScenarioId = "top-to-bottom" | "not-blocking" | "fails" | "all-together";

export interface AsyncAwaitInputs {
  scenario: ScenarioId;
}

/**
 * One trip through an await. These cycle rather than advance: a function with
 * two awaits goes round twice, which is the point — nothing about the second
 * await is different from the first, however long the sequence gets.
 */
export type AwaitPhase =
  | "running"
  | "suspending"
  | "waiting"
  | "queued"
  | "resumed"
  | "done";

/**
 * The async function parked off the call stack. Deliberately not a
 * CallStackFrame: the whole visual argument is that this thing is *not* on the
 * stack while it waits.
 */
export interface SuspendedFn {
  label: string;
  /** What it is waiting for, e.g. `getUser(1)`. */
  awaiting: string;
  /** 1-based line it will continue from once the promise settles. */
  resumeLine: number;
  /** Values already bound before it suspended — they survive the wait. */
  variables?: VariableEntry[];
}

export interface AwaitedPromise {
  label: string;
  state: PromiseState;
  value?: string;
}

export interface AsyncAwaitStepState {
  phase: AwaitPhase;
  callStack: CallStackFrame[];
  suspended?: SuspendedFn;
  awaited?: AwaitedPromise;
  /** Sky chips — the same microtask queue the previous lesson introduced. */
  microtasks: QueueItem[];
  /** Violet chips. Only the capstone puts anything here. */
  taskQueue: QueueItem[];
  /**
   * Whether to render the task queue at all. Constant across every step of a
   * scenario (only `all-together` has a setTimeout), so the panel can never
   * appear or disappear mid-walkthrough.
   */
  showTaskQueue: boolean;
  /** One-line aside rendered below the queues. */
  note?: string;
}
