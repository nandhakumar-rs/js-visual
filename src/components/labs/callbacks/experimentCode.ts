import type { StateBadgeTone } from "@/components/visualizers/StateBadge";
import type { VariableStatus } from "@/components/visualizers/VariableBox";

/** When the work inside getUser finishes. */
export type Timing = "now" | "later";

/** How getUser tries to give the answer back. */
export type Delivery = "return" | "callback";

export const TIMING_LABEL: Record<Timing, string> = {
  now: "Finishes right away",
  later: "Finishes after a timer",
};

export const DELIVERY_LABEL: Record<Delivery, string> = {
  return: "Return the result",
  callback: "Call a callback",
};

/** What the source text says — `id` is still shorthand for the parameter. */
const USER_SOURCE = '{ id, name: "Maya" }';

/** What the console shows once `id` has been substituted. */
const USER_LOGGED = '{ id: 1, name: "Maya" }';

export interface ExperimentCase {
  code: string[];
  /** 1-based line of the `console.log` call, for CodePanel.activeLines. */
  readLine: number;
  /** What that line logs. */
  output: string;
  badge: string;
  tone: StateBadgeTone;
  /** When the log actually appears. */
  whenNote: string;
  boxes: { label: string; value: string; status: VariableStatus }[];
  explanation: string;
}

function buildCode(timing: Timing, delivery: Delivery): string[] {
  if (timing === "now" && delivery === "return") {
    return [
      "function getUser(id) {",
      `  return ${USER_SOURCE};`,
      "}",
      "",
      "const user = getUser(1);",
      "console.log(user);",
    ];
  }
  if (timing === "now" && delivery === "callback") {
    return [
      "function getUser(id, callback) {",
      `  callback(${USER_SOURCE});`,
      "}",
      "",
      "getUser(1, (user) => {",
      "  console.log(user);",
      "});",
    ];
  }
  if (timing === "later" && delivery === "return") {
    return [
      "function getUser(id) {",
      "  setTimeout(() => {",
      `    return ${USER_SOURCE};`,
      "  }, 500);",
      "}",
      "",
      "const user = getUser(1);",
      "console.log(user);",
    ];
  }
  return [
    "function getUser(id, callback) {",
    "  setTimeout(() => {",
    `    callback(${USER_SOURCE});`,
    "  }, 500);",
    "}",
    "",
    "getUser(1, (user) => {",
    "  console.log(user);",
    "});",
  ];
}

/**
 * Code, highlight line and outcome all come from one call, so the preview can
 * never describe a different case than the revealed result — the same
 * guarantee the closures and hoisting experiments give.
 *
 * Only one of the four combinations is broken, and that is the point of the
 * experiment: a return value stops working the moment the work finishes later.
 */
export function buildCase(timing: Timing, delivery: Delivery): ExperimentCase {
  const code = buildCode(timing, delivery);

  // The log is not always the last line (the callback cases close with `});`),
  // so it is located rather than assumed.
  const readLine = code.findIndex((line) => line.includes("console.log")) + 1;

  if (timing === "now" && delivery === "return") {
    return {
      code,
      readLine,
      output: USER_LOGGED,
      badge: "WORKS",
      tone: "success",
      whenNote: "immediately",
      boxes: [{ label: "user", value: USER_LOGGED, status: "set" }],
      explanation:
        "The answer already exists by the time `getUser` returns, so a return value is enough. Nothing here needs a callback.",
    };
  }

  if (timing === "now" && delivery === "callback") {
    return {
      code,
      readLine,
      output: USER_LOGGED,
      badge: "WORKS",
      tone: "success",
      whenNote: "immediately",
      boxes: [{ label: "user", value: USER_LOGGED, status: "set" }],
      explanation:
        "A callback works here too — `getUser` just calls it straight away. Passing a callback is not what makes code asynchronous.",
    };
  }

  if (timing === "later" && delivery === "return") {
    return {
      code,
      readLine,
      output: "undefined",
      badge: "THE RESULT IS LOST",
      tone: "error",
      whenNote: "immediately — the timer has not fired yet",
      boxes: [{ label: "user", value: "undefined", status: "undefined" }],
      explanation:
        "`getUser` reaches its end and returns long before the timer fires, so there is nothing to return yet. The `return` inside `setTimeout` belongs to that arrow function, not to `getUser`, and its value goes nowhere.",
    };
  }

  return {
    code,
    readLine,
    output: USER_LOGGED,
    badge: "WORKS",
    tone: "success",
    whenNote: "about 500ms later",
    boxes: [{ label: "user", value: USER_LOGGED, status: "set" }],
    explanation:
      "`getUser` still returns immediately — but it kept your function and called it once the answer existed. The user arrives as an argument instead of as a return value.",
  };
}
