import type { ScopeLocation, ScopeVariableName } from "./lookup";

// The same three-scope program the Understand phase and the step player use,
// up to the point where the scopes are opened. Only the tail differs, because
// only the read moves.
const HEAD = [
  'const appName = "Visualize JS";',
  "",
  "function greetUser() {",
  '  const userName = "Maya";',
  "",
  "  if (userName) {",
  "    const message = `Welcome, ${userName}`;",
];

export interface ExperimentCode {
  code: string[];
  /** 1-based line of the read, for CodePanel.activeLines. */
  readLine: number;
}

/**
 * Builds the exact source the experiment is asking about, with the read
 * placed inside the chosen scope. Generating the code (rather than describing
 * it in prose) means the learner is predicting the behaviour of a program
 * they can actually see.
 */
export function buildExperimentCode(
  location: ScopeLocation,
  variable: ScopeVariableName
): ExperimentCode {
  const read = `console.log(${variable});`;

  if (location === "block") {
    return {
      code: [...HEAD, `    ${read}`, "  }", "}", "", "greetUser();"],
      readLine: HEAD.length + 1,
    };
  }

  if (location === "function") {
    return {
      code: [...HEAD, "  }", "", `  ${read}`, "}", "", "greetUser();"],
      readLine: HEAD.length + 3,
    };
  }

  return {
    code: [...HEAD, "  }", "}", "", "greetUser();", read],
    readLine: HEAD.length + 5,
  };
}
