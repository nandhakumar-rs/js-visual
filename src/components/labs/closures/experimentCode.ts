/** How the second name was produced. */
export type SecondCounter = "same" | "new";

/** How many times `first()` runs before the highlighted line. */
export type CallsBefore = "1" | "2" | "3";

export const SECOND_COUNTER_LABEL: Record<SecondCounter, string> = {
  same: "Reuse the same one",
  new: "Call createCounter() again",
};

const FACTORY = [
  "function createCounter() {",
  "  let count = 0;",
  "",
  "  return function () {",
  "    count++;",
  "    return count;",
  "  };",
  "}",
];

export interface ExperimentCase {
  code: string[];
  /** 1-based line of the `console.log(second())` call, for CodePanel.activeLines. */
  readLine: number;
  /** What that line logs. */
  output: string;
  badge: string;
  /** Every count that exists in the program, in declaration order. */
  counts: { label: string; value: string }[];
  explanation: string;
}

/**
 * Code, highlight line and outcome all come from one call, so the preview can
 * never describe a different case than the revealed result — the same
 * guarantee hoisting's `buildCase` gives.
 */
export function buildCase(second: SecondCounter, callsBefore: CallsBefore): ExperimentCase {
  const calls = Number(callsBefore);
  const code = [
    ...FACTORY,
    "",
    "const first = createCounter();",
    second === "same" ? "const second = first;" : "const second = createCounter();",
    "",
    ...Array.from({ length: calls }, () => "first();"),
    "",
    "console.log(second());",
  ];

  // The log is always the last line, so the highlight needs no arithmetic and
  // stays correct however many `first()` calls are generated.
  const readLine = code.length;

  if (second === "same") {
    const value = calls + 1;
    return {
      code,
      readLine,
      output: String(value),
      badge: "ONE SHARED COUNT",
      counts: [{ label: "count (shared)", value: String(value) }],
      explanation:
        "`const second = first;` gives the same returned function a second name. Both names lead to one closure, so the earlier `first()` calls already moved the count.",
    };
  }

  return {
    code,
    readLine,
    output: "1",
    badge: "TWO SEPARATE COUNTS",
    counts: [
      { label: "count (first)", value: String(calls) },
      { label: "count (second)", value: "1" },
    ],
    explanation:
      "Calling `createCounter()` again ran `let count = 0;` a second time, creating a separate variable. Nothing `first()` does can reach it, so `second()` is always on its own first call.",
  };
}
