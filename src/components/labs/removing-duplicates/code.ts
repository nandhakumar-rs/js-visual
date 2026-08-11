import type { DedupInputs } from "./types";

export function getCode({ values, method }: DedupInputs): string[] {
  const arr = `[${values.join(", ")}]`;
  switch (method) {
    case "set":
      return [
        `const values = ${arr};`,
        "const uniqueSet = new Set(values);",
        "const unique = [...uniqueSet];",
      ];
    case "filter":
      return [
        `const values = ${arr};`,
        "const unique = values.filter(",
        "  (value, index) => values.indexOf(value) === index",
        ");",
      ];
    case "reduce":
      return [
        `const values = ${arr};`,
        "const unique = values.reduce((result, value) => {",
        "  if (!result.includes(value)) result.push(value);",
        "  return result;",
        "}, []);",
      ];
  }
}
