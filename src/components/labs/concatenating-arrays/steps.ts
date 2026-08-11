import type { ExecutionStep } from "@/lib/execution/types";
import type { ConcatArraysInputs, ConcatArraysStepState } from "./types";

export function buildInitialSteps({ a, b, mode }: ConcatArraysInputs): ExecutionStep<ConcatArraysStepState>[] {
  const result = [...a, ...b];
  const call = mode === "concat" ? "a.concat(b)" : "[...a, ...b]";

  return [
    {
      id: "seed",
      title: "a and b created",
      description: `a = [${a.join(", ")}] and b = [${b.join(", ")}] are two separate array objects.`,
      activeCodeLines: [1, 2],
      state: { a, b },
    },
    {
      id: "combine",
      title: `result = ${call}`,
      description: `${call} builds a brand new array containing every element of a followed by every element of b.`,
      whyExplanation: "Both concat() and spread produce a new array without touching a or b at all — neither original array is mutated.",
      activeCodeLines: [3],
      state: { a, b, result },
    },
    {
      id: "log",
      title: "console.log(a, b, result)",
      description: `a and b are unchanged. result = [${result.join(", ")}].`,
      activeCodeLines: [5],
      consoleOutput: [
        { id: "log-1", kind: "command", content: "console.log(a, b, result)" },
        {
          id: "log-2",
          kind: "output",
          content: `[${a.join(", ")}] [${b.join(", ")}] [${result.join(", ")}]`,
        },
      ],
      state: { a, b, result },
    },
  ];
}
