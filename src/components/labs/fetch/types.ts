import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { QueueItem } from "@/components/visualizers/TaskQueue";
import type { PromiseState } from "@/components/visualizers/PromiseNode";

export interface FetchInputs {
  willSucceed: boolean;
}

export interface FetchStepState {
  promiseState: PromiseState;
  callStack: CallStackFrame[];
  microtasks: QueueItem[];
  loopActive: boolean;
}
