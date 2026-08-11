import type { ModulesInputs } from "./types";

export function getCode({ exportStyle }: ModulesInputs): string[] {
  if (exportStyle === "named") {
    return [
      "// math.js",
      "export const add = (a, b) => a + b;",
      "export const multiply = (a, b) => a * b;",
      "",
      "// app.js",
      'import { add, multiply } from "./math.js";',
      "",
      "add(2, 3);",
    ];
  }
  return [
    "// math.js",
    "export default function add(a, b) {",
    "  return a + b;",
    "}",
    "",
    "// app.js",
    'import add from "./math.js";',
    "",
    "add(2, 3);",
  ];
}
