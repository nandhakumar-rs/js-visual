export type ThisScenario =
  | "object-method"
  | "regular-function"
  | "arrow-function"
  | "class-method"
  | "detached-method";

export interface ThisInputs {
  scenario: ThisScenario;
  useBind: boolean;
}

export interface ThisStepState {
  thisLabel: string;
  result: string;
  isError: boolean;
}
