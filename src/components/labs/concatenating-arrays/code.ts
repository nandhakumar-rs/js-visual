import type { ConcatArraysInputs } from "./types";

export function getCode({ a, b, mode }: ConcatArraysInputs): string[] {
  const line =
    mode === "concat" ? "const result = a.concat(b);" : "const result = [...a, ...b];";
  return [`const a = [${a.join(", ")}];`, `const b = [${b.join(", ")}];`, line, "", "console.log(a, b, result);"];
}
