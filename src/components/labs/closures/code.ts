import type { ClosuresInputs } from "./types";

// The factory is identical in all three scenarios, so lines 1-8 mean the same
// thing everywhere and steps.ts can highlight them by fixed line number.
// Line numbers matter: steps.ts highlights these by 1-based line number, so
// keep each array's shape in sync with the activeCodeLines values there.
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

const ONE_COUNTER = [
  ...FACTORY,
  "",
  "const counterA = createCounter();",
  "",
  "console.log(counterA());",
  "console.log(counterA());",
];

const TWO_COUNTERS = [
  ...FACTORY,
  "",
  "const counterA = createCounter();",
  "const counterB = createCounter();",
  "",
  "console.log(counterA());",
  "console.log(counterB());",
];

const FROM_OUTSIDE = [
  ...FACTORY,
  "",
  "const counterA = createCounter();",
  "counterA();",
  "",
  "console.log(count);",
];

export function getCode({ scenario }: ClosuresInputs): string[] {
  if (scenario === "one-counter") return ONE_COUNTER;
  if (scenario === "two-counters") return TWO_COUNTERS;
  return FROM_OUTSIDE;
}
