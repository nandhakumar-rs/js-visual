import type { ExecutionStep } from "@/lib/execution/types";
import type { DedupInputs, DedupItemStatus, DedupMethod, DedupStepState } from "./types";

const ACTIVE_LINES: Record<DedupMethod, { perItem: number[]; final: number[] }> = {
  set: { perItem: [2], final: [3] },
  filter: { perItem: [3], final: [2, 3, 4] },
  reduce: { perItem: [3], final: [5] },
};

function describeKept(value: number, method: DedupMethod): string {
  switch (method) {
    case "set":
      return `${value} has not appeared before, so the Set accepts it.`;
    case "filter":
      return `${value} is at its first index, so it is kept.`;
    case "reduce":
      return `${value} is not yet in the result, so it is pushed in.`;
  }
}

function describeSkipped(value: number, method: DedupMethod): string {
  switch (method) {
    case "set":
      return `The Set already contains ${value}, so its contents do not change.`;
    case "filter":
      return `${value} already appeared earlier, so this later index is skipped.`;
    case "reduce":
      return `${value} is already in the result, so it is skipped.`;
  }
}

function describeFinal(resultValues: number[], method: DedupMethod): string {
  const arr = `[${resultValues.join(", ")}]`;
  switch (method) {
    case "set":
      return `Spread takes ${resultValues.join(", ") || "nothing"} from the Set and places them in a new array: unique = ${arr}.`;
    case "filter":
      return `filter() has finished checking every value: unique = ${arr}.`;
    case "reduce":
      return `reduce() has finished building the accumulator: unique = ${arr}.`;
  }
}

export function buildInitialSteps({ values, method }: DedupInputs): ExecutionStep<DedupStepState>[] {
  const lines = ACTIVE_LINES[method];
  const steps: ExecutionStep<DedupStepState>[] = [];
  const resultValues: number[] = [];
  const resolvedStatuses: DedupItemStatus[] = [];

  steps.push({
    id: "ready",
    title: "Ready to check",
    description: "No values have been checked yet.",
    activeCodeLines: [1],
    state: {
      itemStatuses: values.map(() => "waiting"),
      resultValues: [],
      isFinal: false,
      currentIndex: -1,
      currentIsDuplicate: false,
    },
  });

  values.forEach((value, i) => {
    const isDuplicate = resultValues.includes(value);
    if (!isDuplicate) resultValues.push(value);
    const status: DedupItemStatus = isDuplicate ? "skipped" : "kept";
    resolvedStatuses.push(status);

    steps.push({
      id: `visit-${i}`,
      title: `Check ${value}`,
      description: isDuplicate ? describeSkipped(value, method) : describeKept(value, method),
      activeCodeLines: lines.perItem,
      state: {
        itemStatuses: values.map((_, j) => (j < i ? resolvedStatuses[j] : j === i ? "checking" : "waiting")),
        resultValues: [...resultValues],
        isFinal: false,
        currentIndex: i,
        currentIsDuplicate: isDuplicate,
      },
    });
  });

  steps.push({
    id: "done",
    title: method === "set" ? "Create the new array" : "Result",
    description: describeFinal(resultValues, method),
    activeCodeLines: lines.final,
    consoleOutput: [{ id: "log-1", kind: "output", content: `[${resultValues.join(", ")}]` }],
    state: {
      itemStatuses: [...resolvedStatuses],
      resultValues: [...resultValues],
      isFinal: true,
      currentIndex: -1,
      currentIsDuplicate: false,
    },
  });

  return steps;
}
