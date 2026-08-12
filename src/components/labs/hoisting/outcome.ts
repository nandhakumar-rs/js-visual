import type { BindingState, DeclarationType } from "./types";

export type Moment = "before" | "after";

export const DECLARATION_LABEL: Record<DeclarationType, string> = {
  var: "var",
  let: "let",
  const: "const",
  function: "function declaration",
};

export const MOMENT_LABEL: Record<Moment, string> = {
  before: "Before declaration line",
  after: "After declaration line",
};

export interface ExperimentCase {
  /** The generated program for this combination, shown before checking. */
  code: string[];
  /** 1-based line where the value is read (or the function is called). */
  useLine: number;
  /** 1-based line of the declaration being tested. */
  declarationLine: number;
  /** Did the read/call produce a value, or throw? */
  succeeded: boolean;
  /** Short text label — meaning never depends on color alone. */
  badge: string;
  /** The literal thing JavaScript produces. */
  output: string;
  /** The binding's state at the moment of use, in BindingRecord's vocabulary. */
  bindingState: BindingState;
  /** One concise explanation, referencing the highlighted lines. */
  explanation: string;
}

function variableCode(kind: DeclarationType, moment: Moment): string[] {
  const declaration = `  ${kind} status = "Ready";`;
  const use = "  console.log(status);";
  return moment === "before"
    ? ["function inspect() {", use, declaration, "}", "", "inspect();"]
    : ["function inspect() {", declaration, use, "}", "", "inspect();"];
}

const FUNCTION_BEFORE = [
  "function inspect() {",
  "  startLesson();",
  "",
  "  function startLesson() {",
  '    console.log("Ready");',
  "  }",
  "}",
  "",
  "inspect();",
];

const FUNCTION_AFTER = [
  "function inspect() {",
  "  function startLesson() {",
  '    console.log("Ready");',
  "  }",
  "",
  "  startLesson();",
  "}",
  "",
  "inspect();",
];

/**
 * Single source of truth for all eight declaration x moment combinations —
 * the generated code, the lines to highlight, and the outcome all come from
 * here, so the preview can never describe a different case than the result.
 *
 * Nothing is executed: a "ReferenceError" is rendered data, never a thrown
 * error, so no combination can crash the page.
 */
export function buildCase(kind: DeclarationType, moment: Moment): ExperimentCase {
  if (kind === "function") {
    const before = moment === "before";
    return {
      code: before ? FUNCTION_BEFORE : FUNCTION_AFTER,
      useLine: before ? 2 : 6,
      declarationLine: before ? 4 : 2,
      succeeded: true,
      badge: "FUNCTION CALL SUCCEEDS",
      output: '"Ready"',
      bindingState: "function-ready",
      explanation: before
        ? "The function declaration on line 4 was initialized with its function when the scope was prepared, so the call on line 2 already works."
        : "The declaration on line 2 has been evaluated and the call on line 6 runs normally — a function declaration is callable on either side of its line.",
    };
  }

  const code = variableCode(kind, moment);
  const useLine = moment === "before" ? 2 : 3;
  const declarationLine = moment === "before" ? 3 : 2;

  if (moment === "after") {
    return {
      code,
      useLine,
      declarationLine,
      succeeded: true,
      badge: 'LOGS "Ready"',
      output: '"Ready"',
      bindingState: "initialized-value",
      explanation:
        kind === "var"
          ? 'The declaration and assignment on line 2 have executed, so `status` now contains `"Ready"`.'
          : 'The declaration on line 2 has executed, so the binding is initialized and contains `"Ready"`.',
    };
  }

  if (kind === "var") {
    return {
      code,
      useLine,
      declarationLine,
      succeeded: true,
      badge: "LOGS undefined",
      output: "undefined",
      bindingState: "initialized-undefined",
      explanation:
        'The binding was created and initialized with `undefined` when the scope was prepared. The assignment to `"Ready"` on line 3 has not executed yet.',
    };
  }

  return {
    code,
    useLine,
    declarationLine,
    succeeded: false,
    badge: "THROWS ReferenceError",
    output: "Uncaught ReferenceError: Cannot access 'status' before initialization",
    bindingState: "uninitialized",
    explanation:
      "The binding exists, but it is still uninitialized in the Temporal Dead Zone. Reading it on line 2 throws a `ReferenceError`.",
  };
}
