import type { CallStackFrame } from "@/components/visualizers/CallStack";

export interface ExecutionContextInputs {
  a: number;
  b: number;
  bonus: number;
}

export type ExecutionContextPhase =
  | "global-start"
  | "calculate-called"
  | "multiply-called"
  | "multiply-returns"
  | "calculate-returns"
  | "console-log";

export interface ExecutionContextStepState {
  phase: ExecutionContextPhase;
  callStack: CallStackFrame[];
}
