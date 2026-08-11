import type { RangeInputs } from "./types";

export function getCode({ start, end, step }: RangeInputs): string[] {
  return [
    "function range(start, end, step = 1) {",
    "  const result = [];",
    "  for (let i = start; i < end; i += step) {",
    "    result.push(i);",
    "  }",
    "  return result;",
    "}",
    "",
    `range(${start}, ${end}, ${step});`,
  ];
}
