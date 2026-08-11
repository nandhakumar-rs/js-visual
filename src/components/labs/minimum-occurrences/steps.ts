import type { ExecutionStep } from "@/lib/execution/types";
import type { MinOccurrencesInputs, MinOccurrencesStepState } from "./types";

export function buildInitialSteps({ array }: MinOccurrencesInputs): ExecutionStep<MinOccurrencesStepState>[] {
  const steps: ExecutionStep<MinOccurrencesStepState>[] = [];
  let currentMin = Infinity;

  array.forEach((value, i) => {
    const isNewMin = value < currentMin;
    if (isNewMin) currentMin = value;
    steps.push({
      id: `scan-${i}`,
      title: `Check ${value}`,
      description: isNewMin
        ? `${value} is the smallest value seen so far.`
        : `${value} is not smaller than the current minimum (${currentMin}).`,
      activeCodeLines: [2],
      state: { stage: "scanning", activeIndex: i, currentMin, matchIndices: [] },
    });
  });

  const min = currentMin;
  steps.push({
    id: "min-found",
    title: `Minimum is ${min}`,
    description: `Math.min(...array) = ${min}`,
    activeCodeLines: [2],
    state: { stage: "min-found", currentMin: min, min, matchIndices: [] },
  });

  const matchIndices: number[] = [];
  array.forEach((value, i) => {
    const isMatch = value === min;
    if (isMatch) matchIndices.push(i);
    steps.push({
      id: `count-${i}`,
      title: `${value} ${isMatch ? "matches" : "doesn't match"} the minimum`,
      description: isMatch ? `${value} === ${min} ✅` : `${value} !== ${min} ❌`,
      activeCodeLines: [3],
      state: { stage: "counting", min, matchIndices: [...matchIndices] },
    });
  });

  steps.push({
    id: "done",
    title: "Result",
    description: `Minimum: ${min}. Occurrences: ${matchIndices.length}.`,
    activeCodeLines: [3],
    consoleOutput: [
      { id: "log-1", kind: "output", content: `Minimum: ${min}` },
      { id: "log-2", kind: "output", content: `Occurrences: ${matchIndices.length}` },
    ],
    state: { stage: "done", min, occurrences: matchIndices.length, matchIndices },
  });

  return steps;
}
