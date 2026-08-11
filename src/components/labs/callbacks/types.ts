import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { QueueItem } from "@/components/visualizers/TaskQueue";

export interface CallbacksInputs {
  delayMs: number;
}

export interface CallbacksStepState {
  callStack: CallStackFrame[];
  webApis: QueueItem[];
  macrotasks: QueueItem[];
  loopActive: boolean;
}
