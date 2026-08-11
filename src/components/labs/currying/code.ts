import type { CurryingInputs } from "./types";

export function getCode({ a, b }: CurryingInputs): string[] {
  return [
    "function multiply(a) {",
    "  return function (b) {",
    "    return a * b;",
    "  };",
    "}",
    "",
    `multiply(${a})(${b});`,
  ];
}
