import type { ShuffleInputs } from "./types";

export function getCode({ mode }: ShuffleInputs): string[] {
  if (mode === "flawed-sort") {
    return ["const shuffled = array.sort(() => Math.random() - 0.5);", "// biased — do not use this in real code"];
  }
  return [
    "function shuffle(array) {",
    "  for (let i = array.length - 1; i > 0; i--) {",
    "    const j = Math.floor(Math.random() * (i + 1));",
    "    [array[i], array[j]] = [array[j], array[i]];",
    "  }",
    "  return array;",
    "}",
  ];
}
