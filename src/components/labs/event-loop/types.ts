import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { QueueItem } from "@/components/visualizers/TaskQueue";

/** The four walkthroughs the scenario picker offers. */
export type ScenarioId = "zero-timeout" | "two-timers" | "busy-stack" | "all-together";

export interface EventLoopInputs {
  scenario: ScenarioId;
}

/**
 * Where the walkthrough is in the loop. These cycle rather than advance: the
 * same three beats run again for every queued task, which is why the phase
 * strip loops.
 */
export type LoopPhase =
  | "running-sync"
  | "waiting"
  | "queued"
  | "loop-blocked"
  | "loop-moves"
  | "callback-runs"
  | "done";

/** A pending Web API task — the browser's side of the handoff, off the stack. */
export interface WebApiTask {
  id: string;
  /** e.g. "setTimeout 100ms". */
  label: string;
  durationMs: number;
  /** Drives the Timer ring. 0 means the wait is over. */
  remainingMs: number;
}

export interface EventLoopStepState {
  phase: LoopPhase;
  callStack: CallStackFrame[];
  webApis: WebApiTask[];
  taskQueue: QueueItem[];
  /** Whether the loop may move anything across right now. Drives LoopGate. */
  stackEmpty: boolean;
  /** Set on the step where the loop actually moves an item onto the stack. */
  movingId?: string;
  /** One-line aside rendered under the boxes. */
  note?: string;
}
