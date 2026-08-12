/** The four declaration kinds the "Try it yourself" experiment offers. */
export type DeclarationType = "var" | "let" | "const" | "function";

/**
 * The player runs three scenarios, not four: `let` and `const` behave
 * identically before their declaration line, so walking through both would
 * teach the same beat twice.
 */
export type ScenarioId = "var" | "let-const" | "function";

export interface HoistingInputs {
  scenario: ScenarioId;
}

/** Where execution is relative to the binding's declaration line. */
export type BindingPhase =
  | "entering"
  | "preparing"
  | "before-declaration"
  | "after-declaration"
  | "halted";

/**
 * The states this lesson must keep visually distinct. In particular
 * `uninitialized` and `initialized-undefined` are different things — a
 * binding in the TDZ has no value at all, it is not holding `undefined`.
 */
export type BindingState =
  | "none"
  | "uninitialized"
  | "initialized-undefined"
  | "initialized-value"
  | "function-ready"
  | "halted";

export interface HoistingStepState {
  identifier: string;
  declaredWith: DeclarationType;
  phase: BindingPhase;
  bindingState: BindingState;
  /** What the binding currently holds, or a marker like `<uninitialized>`. */
  displayValue?: string;
  /** Shown as a strikethrough transition on the value chip when it changes. */
  previousDisplayValue?: string;
  /** What reading (or calling) the identifier right now would produce. */
  readResult: string;
}
