import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { QueueItem } from "@/components/visualizers/TaskQueue";
import type { PromiseState } from "@/components/visualizers/PromiseNode";

export type ConversionStyle = "callback" | "promise";

export interface CallbackToPromiseInputs {
  style: ConversionStyle;
}

export interface CallbackToPromiseStepState {
  callStack: CallStackFrame[];
  webApis: QueueItem[];
  promiseState?: PromiseState;
  result?: string;
}
