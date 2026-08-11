import type { ExecutionStep } from "@/lib/execution/types";
import type { SortingInputs, SortingStepState } from "./types";

interface BubbleEvent {
  i: number;
  j: number;
  swapped: boolean;
  arrayAfter: number[];
}

function bubbleSortEvents(input: number[]): BubbleEvent[] {
  const a = [...input];
  const events: BubbleEvent[] = [];
  const n = a.length;
  for (let pass = 0; pass < n - 1; pass++) {
    for (let i = 0; i < n - 1 - pass; i++) {
      const swapped = a[i] > a[i + 1];
      if (swapped) {
        const tmp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = tmp;
      }
      events.push({ i, j: i + 1, swapped, arrayAfter: [...a] });
    }
  }
  return events;
}

export function buildInitialSteps({ array, mode }: SortingInputs): ExecutionStep<SortingStepState>[] {
  if (mode === "default") {
    // The actual (surprising) result of JavaScript's default sort: elements
    // are coerced to strings and compared lexicographically.
    const result = [...array].sort();
    return [
      {
        id: "seed",
        title: "numbers created",
        description: `numbers = [${array.join(", ")}]`,
        activeCodeLines: [1],
        state: { numbers: array },
      },
      {
        id: "sorted",
        title: "numbers.sort() runs — with no comparator",
        description: `Without a comparator, sort() converts every element to a string and compares them as text. Result: [${result.join(", ")}].`,
        whyExplanation:
          '"10" comes before "2" alphabetically (because "1" < "2"), even though 10 is numerically bigger than 2. This is why sort() needs an explicit numeric comparator.',
        activeCodeLines: [2],
        consoleOutput: [
          { id: "log-1", kind: "command", content: "numbers.sort()" },
          { id: "log-2", kind: "warning", content: `[${result.join(", ")}] ← probably not what you expected!` },
        ],
        state: { numbers: result },
      },
    ];
  }

  const events = bubbleSortEvents(array);
  const steps: ExecutionStep<SortingStepState>[] = [
    {
      id: "seed",
      title: "numbers created",
      description: `numbers = [${array.join(", ")}]`,
      activeCodeLines: [1],
      state: mode === "immutable" ? { numbers: array, sorted: array } : { numbers: array },
    },
  ];

  let current = [...array];
  events.forEach((event, idx) => {
    const before = current;
    current = event.arrayAfter;
    steps.push({
      id: `compare-${idx}`,
      title: `Compare ${before[event.i]} and ${before[event.j]}`,
      description: event.swapped
        ? `${before[event.i]} > ${before[event.j]}, so they swap places.`
        : `${before[event.i]} <= ${before[event.j]}, so they stay in place.`,
      activeCodeLines: [2],
      state:
        mode === "immutable"
          ? { numbers: array, sorted: current, compareIndices: [event.i, event.j], swapped: event.swapped }
          : { numbers: current, compareIndices: [event.i, event.j], swapped: event.swapped },
    });
  });

  const finalArray = current;
  steps.push({
    id: "done",
    title: "Sorted",
    description:
      mode === "immutable"
        ? `sorted = [${finalArray.join(", ")}]. numbers is untouched: [${array.join(", ")}].`
        : `numbers = [${finalArray.join(", ")}]. The original array was mutated in place.`,
    whyExplanation:
      mode === "immutable"
        ? "toSorted() returns a new sorted array and leaves the original completely untouched."
        : "sort() with a comparator sorts the array in place and also returns it — the same array object, now reordered.",
    activeCodeLines: [2],
    consoleOutput: [
      {
        id: "log-1",
        kind: "output",
        content:
          mode === "immutable"
            ? `numbers: [${array.join(", ")}]  sorted: [${finalArray.join(", ")}]`
            : `[${finalArray.join(", ")}]`,
      },
    ],
    state:
      mode === "immutable"
        ? { numbers: array, sorted: finalArray }
        : { numbers: finalArray },
  });

  return steps;
}
