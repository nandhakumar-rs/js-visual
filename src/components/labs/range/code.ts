import type { RangeInputs } from "./types";

export function getCode({ start, end, step }: RangeInputs): string[] {
  return [
    "function range(",
    "  start, end, step = 1",
    ") {",
    "  if (step === 0) {",
    "    throw new RangeError(",
    '      "step cannot be 0"',
    "    );",
    "  }",
    "",
    "  const result = [];",
    "  let value = start;",
    "  const up = step > 0;",
    "",
    "  while (",
    "    up ? value < end : value > end",
    "  ) {",
    "    result.push(value);",
    "    value += step;",
    "  }",
    "",
    "  return result;",
    "}",
    "",
    `range(${start}, ${end}, ${step});`,
  ];
}
