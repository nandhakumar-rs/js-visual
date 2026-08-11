import type { SortingInputs } from "./types";

export function getCode({ array, mode }: SortingInputs): string[] {
  const arr = `[${array.join(", ")}]`;
  switch (mode) {
    case "default":
      return [`const numbers = ${arr};`, "numbers.sort();"];
    case "numeric":
      return [`const numbers = ${arr};`, "numbers.sort((a, b) => a - b);"];
    case "immutable":
      return [`const numbers = ${arr};`, "const sorted = numbers.toSorted((a, b) => a - b);"];
  }
}
