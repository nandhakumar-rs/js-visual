import type { ExecutionStep } from "@/lib/execution/types";
import type { SortingComparison, SortingInputs, SortingStepState, SortMode } from "./types";

// Picks 2 illustrative pairs from the actual input (first two values, and the
// array's max vs min) to demonstrate the comparator rule. This is never meant
// to represent the engine's real internal comparison sequence — different
// engines may compare values in a different order.
function representativePairs(values: number[]): [number, number][] {
  if (values.length < 2) return [];
  const pairs: [number, number][] = [[values[0], values[1]]];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const isSamePair = (max === values[0] && min === values[1]) || (max === values[1] && min === values[0]);
  if (max !== min && !isSamePair) {
    pairs.push([max, min]);
  } else if (values.length > 2) {
    pairs.push([values[values.length - 2], values[values.length - 1]]);
  }
  return pairs.slice(0, 2);
}

function comparatorFor(mode: SortMode): (a: number, b: number) => number {
  return mode === "desc" ? (a, b) => b - a : (a, b) => a - b;
}

function buildComparisons(values: number[], mode: SortMode): SortingComparison[] {
  const comparator = comparatorFor(mode);
  return representativePairs(values).map(([a, b]) => ({ a, b, result: comparator(a, b) }));
}

const EMPTY: Pick<SortingStepState, "sorted" | "compareValues" | "comparisons"> = {
  sorted: null,
  compareValues: null,
  comparisons: null,
};

export function buildInitialSteps({ values, mode }: SortingInputs): ExecutionStep<SortingStepState>[] {
  if (mode === "default") {
    // The actual (surprising) result of JavaScript's default sort: elements
    // are coerced to strings and compared lexicographically.
    const textSorted = values.map(String).sort();
    const result = [...values].sort();
    return [
      {
        id: "ready",
        title: "Numbers are ready",
        description: `numbers = [${values.join(", ")}]. Nothing has been sorted yet.`,
        activeCodeLines: [1],
        state: { numbers: values, ...EMPTY, isFinal: false },
      },
      {
        id: "text-convert",
        title: "Values are compared as text",
        description: "Without a comparator, sort() converts every value to a string before comparing.",
        activeCodeLines: [2],
        state: { numbers: values, ...EMPTY, compareValues: values.map(String), isFinal: false },
      },
      {
        id: "text-order",
        title: "Text order is applied",
        description:
          "Each value's characters are compared from left to right, so a value that “looks bigger” can still sort before one that looks smaller.",
        activeCodeLines: [2],
        state: { numbers: values, ...EMPTY, compareValues: textSorted, isFinal: false },
      },
      {
        id: "mutated",
        title: "The source array is mutated",
        description: `Result: [${result.join(", ")}] — valid text order, but probably not the numeric order you intended.`,
        activeCodeLines: [2],
        state: { numbers: result, sorted: result, compareValues: null, comparisons: null, isFinal: true },
      },
    ];
  }

  const comparator = comparatorFor(mode);
  const result = mode === "immutable" ? values.toSorted(comparator) : [...values].sort(comparator);
  const ruleText =
    mode === "desc"
      ? "b - a > 0 means a comes first. b - a < 0 means b comes first. 0 means they're treated as equal."
      : "a - b < 0 means a comes first. a - b > 0 means b comes first. 0 means they're treated as equal.";

  return [
    {
      id: "ready",
      title: "Numbers are ready",
      description: `numbers = [${values.join(", ")}]. Nothing has been sorted yet.`,
      activeCodeLines: [1],
      state: { numbers: values, ...EMPTY, isFinal: false },
    },
    {
      id: "read-rule",
      title: "Read the comparator rule",
      description: ruleText,
      activeCodeLines: [2],
      state: { numbers: values, ...EMPTY, isFinal: false },
    },
    {
      id: "representative",
      title: "Try representative comparisons",
      description:
        values.length < 2
          ? "Only one value — nothing to compare."
          : "These pairs show the rule in action. This isn't necessarily the exact sequence the engine compares internally.",
      activeCodeLines: [2],
      state: { numbers: values, ...EMPTY, comparisons: buildComparisons(values, mode), isFinal: false },
    },
    {
      id: "apply-order",
      title: "Apply the resulting order",
      description: `The comparator resolves the full order: [${result.join(", ")}].`,
      activeCodeLines: [2],
      state: {
        numbers: mode === "immutable" ? values : result,
        sorted: result,
        compareValues: null,
        comparisons: null,
        isFinal: false,
      },
    },
    {
      id: mode === "immutable" ? "created" : "mutated",
      title: mode === "immutable" ? "A new array is created" : "The source array is mutated",
      description:
        mode === "immutable"
          ? `sorted = [${result.join(", ")}]. numbers is untouched: [${values.join(", ")}].`
          : `numbers = [${result.join(", ")}]. The original array was mutated in place.`,
      activeCodeLines: [2],
      state: {
        numbers: mode === "immutable" ? values : result,
        sorted: result,
        compareValues: null,
        comparisons: null,
        isFinal: true,
      },
    },
  ];
}
