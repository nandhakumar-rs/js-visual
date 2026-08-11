import type { ImmutableArrayInputs } from "./types";

export function getCode({ newValue, mode }: ImmutableArrayInputs): string[] {
  if (mode === "push") {
    return ["const array = [1, 2, 3];", "", `array.push(${newValue});`, "console.log(array);"];
  }
  return [
    "const original = [1, 2, 3];",
    "",
    `const updated = [...original, ${newValue}];`,
    "console.log(original, updated);",
  ];
}
