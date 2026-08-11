import type { ExecutionStep } from "@/lib/execution/types";
import type { CurryingInputs, CurryingStepState } from "./types";

export function buildInitialSteps({ a, b }: CurryingInputs): ExecutionStep<CurryingStepState>[] {
  return [
    {
      id: "seed",
      title: "Ready to call",
      description: `multiply(${a})(${b}) is written as two separate calls, one right after the other.`,
      activeCodeLines: [7],
      state: { stage: "idle" },
    },
    {
      id: "outer",
      title: `multiply(${a}) runs`,
      description: `multiply(${a}) executes and immediately returns a new inner function — one that remembers a = ${a} through a closure.`,
      whyExplanation: `The inner function closes over a, so it will keep remembering a = ${a} for as long as it exists, even after multiply() has finished running.`,
      activeCodeLines: [1, 2],
      state: { stage: "outer", a },
    },
    {
      id: "inner",
      title: `(${b}) runs`,
      description: `The returned function is now called with b = ${b}. It computes a * b using the remembered a.`,
      whyExplanation: `Because of the closure, a is still available even though multiply()'s own call already finished.`,
      activeCodeLines: [3],
      state: { stage: "inner", a, b },
    },
    {
      id: "done",
      title: "Result",
      description: `${a} × ${b} = ${a * b}`,
      whyExplanation: `Currying splits multiply(a, b) into multiply(a)(b) — a chain of single-argument functions, each remembering what came before via closures.`,
      activeCodeLines: [7],
      consoleOutput: [
        { id: "log-1", kind: "command", content: `multiply(${a})(${b})` },
        { id: "log-2", kind: "output", content: String(a * b) },
      ],
      state: { stage: "done", a, b, result: a * b },
    },
  ];
}
