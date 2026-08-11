import type { SortingInputs } from "./types";

export function getCode({ values, mode }: SortingInputs): string[] {
  const arr = `[${values.join(", ")}]`;
  switch (mode) {
    case "default":
      return [`const numbers = ${arr};`, "numbers.sort();"];
    case "asc":
      return [`const numbers = ${arr};`, "numbers.sort((a, b) => a - b);"];
    case "desc":
      return [`const numbers = ${arr};`, "numbers.sort((a, b) => b - a);"];
    case "immutable":
      return [`const numbers = ${arr};`, "const sorted = numbers.toSorted((a, b) => a - b);"];
  }
}
