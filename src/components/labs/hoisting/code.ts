import type { HoistingInputs } from "./types";

// Line numbers matter: steps.ts highlights these by 1-based line number, so
// keep each array's shape in sync with the activeCodeLines values there.
const VAR_CODE = [
  "function inspectVar() {",
  "  console.log(status);",
  '  var status = "Ready";',
  "  console.log(status);",
  "}",
  "",
  "inspectVar();",
];

const LET_CODE = [
  "function inspectLet() {",
  "  console.log(status);",
  '  let status = "Ready";',
  "}",
  "",
  "inspectLet();",
];

const FUNCTION_CODE = [
  "function runLesson() {",
  "  startLesson();",
  "",
  "  function startLesson() {",
  '    console.log("Ready");',
  "  }",
  "}",
  "",
  "runLesson();",
];

export function getCode({ scenario }: HoistingInputs): string[] {
  if (scenario === "var") return VAR_CODE;
  if (scenario === "let-const") return LET_CODE;
  return FUNCTION_CODE;
}
