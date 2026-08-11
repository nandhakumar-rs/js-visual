import type { ExecutionStep } from "@/lib/execution/types";
import type { RangeInputs, RangeStepState } from "./types";

const MAX_ITERATIONS = 200;

export function buildInitialSteps({ start, end, step }: RangeInputs): ExecutionStep<RangeStepState>[] {
  const safeStep = step === 0 ? 1 : step;

  const steps: ExecutionStep<RangeStepState>[] = [
    {
      id: "seed",
      title: "range() starts",
      description: `i starts at ${start}. result is an empty array.`,
      activeCodeLines: [1, 2, 3],
      state: { result: [] },
    },
  ];

  const result: number[] = [];
  let i = start;
  let guard = 0;
  while (safeStep > 0 ? i < end : i > end) {
    result.push(i);
    steps.push({
      id: `push-${i}`,
      title: `Push ${i}`,
      description: `result.push(${i}) — result is now [${result.join(", ")}].`,
      activeCodeLines: [4],
      state: { result: [...result], current: i },
    });
    i += safeStep;
    guard++;
    if (guard >= MAX_ITERATIONS) break;
  }

  steps.push({
    id: "return",
    title: "Loop condition fails — return result",
    description: `i is no longer ${safeStep > 0 ? "less" : "greater"} than ${end}, so the loop stops and result is returned.`,
    whyExplanation: "A for loop keeps running only while its condition stays true — once it flips, the loop exits immediately.",
    activeCodeLines: [3, 6],
    consoleOutput: [{ id: "log-1", kind: "output", content: `[${result.join(", ")}]` }],
    state: { result },
  });

  return steps;
}
