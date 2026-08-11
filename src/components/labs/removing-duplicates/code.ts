import type { DedupInputs } from "./types";

export function getCode({ array, method }: DedupInputs): string[] {
  const arr = `[${array.join(", ")}]`;
  switch (method) {
    case "set":
      return [`const array = ${arr};`, "const unique = [...new Set(array)];"];
    case "filter":
      return [`const array = ${arr};`, "const unique = array.filter((v, i) => array.indexOf(v) === i);"];
    case "reduce":
      return [
        `const array = ${arr};`,
        "const unique = array.reduce(",
        "  (acc, v) => (acc.includes(v) ? acc : [...acc, v]),",
        "  []",
        ");",
      ];
  }
}
