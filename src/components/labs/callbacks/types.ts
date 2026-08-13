import type { VariableStatus } from "@/components/visualizers/VariableBox";

/** The three walkthroughs the scenario picker offers. */
export type ScenarioId = "right-away" | "later" | "fails";

export interface CallbacksInputs {
  scenario: ScenarioId;
}

/**
 * Where execution is relative to the handoff. The lesson turns on `working`:
 * that is the moment the caller has already moved on and the answer does not
 * exist yet, which is why it cannot come back as a return value.
 */
export type CallbackPhase = "handing-over" | "held" | "working" | "calling-back" | "done";

/** What the code that handed the function over is doing right now. */
export type CallerStatus = "running" | "moved-on" | "finished";

/** What the function that received the callback is doing with it. */
export type ReceiverStatus = "idle" | "holding" | "working" | "calling" | "returned";

/** One argument the callback was actually invoked with. */
export interface CallbackArg {
  name: string;
  displayValue: string;
  status: VariableStatus;
}

export interface CallbacksStepState {
  phase: CallbackPhase;
  callerStatus: CallerStatus;
  /** Display name of the function the callback was handed to, e.g. "getUser()". */
  receiverName: string;
  receiverStatus: ReceiverStatus;
  /**
   * The name the receiving function knows the callback by. Showing this makes
   * the point that the receiver renames it — the caller never chose "callback".
   */
  parameterName: string;
  /** The arguments the callback ran with. Present from `calling-back` onward. */
  calledWith?: CallbackArg[];
  /** Error-first scenario: the error branch was taken. */
  failed?: boolean;
  /** One-line aside rendered under the cards. */
  note?: string;
}
