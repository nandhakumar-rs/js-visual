import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { VariableStatus } from "@/components/visualizers/VariableBox";

export type DeclarationType = "var" | "let" | "const" | "function";

export interface HoistingInputs {
  declarationType: DeclarationType;
}

export interface HoistingBinding {
  name: string;
  status: VariableStatus;
  displayValue?: string;
  previousValue?: unknown;
}

export interface HoistingStepState {
  phase: "creation" | "execution" | "halted";
  binding: HoistingBinding;
  callStack: CallStackFrame[];
}
