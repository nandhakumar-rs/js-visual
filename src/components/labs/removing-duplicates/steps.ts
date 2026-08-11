import type { ExecutionStep } from "@/lib/execution/types";
import type { DedupInputs, DedupStepState } from "./types";

export function buildInitialSteps({ array, method }: DedupInputs): ExecutionStep<DedupStepState>[] {
  const activeLine = method === "set" ? 2 : method === "filter" ? 2 : 3;
  const steps: ExecutionStep<DedupStepState>[] = [];
  const seen: number[] = [];

  array.forEach((value, i) => {
    const isDuplicate = seen.includes(value);
    if (!isDuplicate) seen.push(value);
    steps.push({
      id: `visit-${i}`,
      title: `Visit ${value}`,
      description: isDuplicate
        ? `${value} is already in the result — it's skipped.`
        : `${value} hasn't been seen before — it's added to the result.`,
      whyExplanation: isDuplicate
        ? "A Set (and the filter/reduce equivalents) only ever keeps the first occurrence of each value."
        : "This is the first time this value has appeared, so it becomes part of the unique result.",
      activeCodeLines: [activeLine],
      state: { visitedIndex: i, seen: [...seen], isDuplicate },
    });
  });

  steps.push({
    id: "done",
    title: "Result",
    description: `unique = [${seen.join(", ")}]`,
    activeCodeLines: [activeLine],
    consoleOutput: [{ id: "log-1", kind: "output", content: `[${seen.join(", ")}]` }],
    state: { visitedIndex: array.length - 1, seen, isDuplicate: false },
  });

  return steps;
}
