import type { ExecutionContextInputs } from "./types";

export function getCode({ a, b, bonus }: ExecutionContextInputs): string[] {
  return [
    "function multiply(a, b) {",
    "  return a * b;",
    "}",
    "",
    "function calculate() {",
    `  const subtotal = multiply(${a}, ${b});`,
    `  return subtotal + ${bonus};`,
    "}",
    "",
    "const total = calculate();",
    'console.log("total:", total);',
  ];
}
