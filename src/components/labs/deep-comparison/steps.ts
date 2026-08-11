import type { ExecutionStep } from "@/lib/execution/types";
import type { CheckedNode, DeepComparisonInputs, DeepComparisonStepState } from "./types";

export function buildInitialSteps({
  nameA,
  nameB,
  cityA,
  cityB,
}: DeepComparisonInputs): ExecutionStep<DeepComparisonStepState>[] {
  const checked: CheckedNode[] = [];
  const steps: ExecutionStep<DeepComparisonStepState>[] = [
    {
      id: "seed",
      title: "deepEqual(a, b) starts at the root",
      description: "The recursion begins by comparing a and b as a whole.",
      activeCodeLines: [4],
      state: { checked: [], comparisons: 0 },
    },
  ];

  const nameMatch = nameA === nameB;
  checked.push({ path: "name", match: nameMatch });
  steps.push({
    id: "check-name",
    title: "Compare root.name",
    description: nameMatch ? `"${nameA}" === "${nameB}" ✅` : `"${nameA}" !== "${nameB}" ❌`,
    activeCodeLines: [8],
    state: { checked: [...checked], activePath: "name", comparisons: 1 },
  });

  const cityMatch = cityA === cityB;
  steps.push({
    id: "enter-address",
    title: "Recurse into root.address",
    description: "address is an object, so deepEqual calls itself again on address.city instead of stopping.",
    whyExplanation: "This is the key difference from shallow comparison: instead of comparing address by reference, deepEqual keeps recursing into it.",
    activeCodeLines: [4, 5, 6],
    state: { checked: [...checked], activePath: "address", comparisons: 2 },
  });

  checked.push({ path: "address.city", match: cityMatch });
  steps.push({
    id: "check-city",
    title: "Compare address.city",
    description: cityMatch ? `"${cityA}" === "${cityB}" ✅` : `"${cityA}" !== "${cityB}" ❌`,
    activeCodeLines: [8],
    state: { checked: [...checked], activePath: "address.city", comparisons: 3 },
  });

  const result = nameMatch && cityMatch;
  steps.push({
    id: "result",
    title: "Result",
    description: `deepEqual(a, b) → ${result}. Comparisons performed: 3.`,
    whyExplanation: result
      ? "Every leaf value matched, all the way down, so the objects are considered deeply equal."
      : "At least one leaf value didn't match, so the whole comparison fails at that node — the rest of the traversal short-circuits.",
    activeCodeLines: [11],
    consoleOutput: [
      { id: "log-1", kind: "output", content: String(result) },
      { id: "log-2", kind: "output", content: "Comparisons performed: 3" },
    ],
    state: { checked: [...checked], comparisons: 3, result },
  });

  return steps;
}
