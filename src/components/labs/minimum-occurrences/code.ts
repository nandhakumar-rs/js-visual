import type { MinOccurrencesInputs } from "./types";

export function getCode({ array }: MinOccurrencesInputs): string[] {
  return [
    `const array = [${array.join(", ")}];`,
    "const min = Math.min(...array);",
    "const occurrences = array.filter(n => n === min).length;",
  ];
}
