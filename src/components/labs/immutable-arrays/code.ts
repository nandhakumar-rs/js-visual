import type { ImmutableArrayInputs } from "./types";

export function getCode({ mode, newValue }: ImmutableArrayInputs): string[] {
  if (mode === "push") {
    return ["const array = [1, 2, 3];", `array.push(${newValue});`, "", "console.log(array);"];
  }
  return [
    "const array = [1, 2, 3];",
    `const newArray = [...array, ${newValue}];`,
    "",
    "console.log(array, newArray);",
  ];
}
