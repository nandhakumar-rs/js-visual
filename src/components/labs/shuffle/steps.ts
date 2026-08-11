import type { ExecutionStep } from "@/lib/execution/types";
import type { ShuffleInputs, ShuffleStepState } from "./types";

export function buildInitialSteps({ items, mode }: ShuffleInputs): ExecutionStep<ShuffleStepState>[] {
  if (mode === "flawed-sort") {
    const result = [...items].sort(() => Math.random() - 0.5);
    return [
      {
        id: "seed",
        title: "Starting order",
        description: `[${items.join(", ")}]`,
        activeCodeLines: [],
        state: { items },
      },
      {
        id: "flawed",
        title: "array.sort(() => Math.random() - 0.5)",
        description: `Result: [${result.join(", ")}]`,
        whyExplanation:
          "This looks random, but it isn't a fair shuffle. Sort algorithms don't compare every pair of elements equally — some elements end up statistically more likely to stay near their original position than others, so this produces a biased distribution, not a uniformly random one.",
        activeCodeLines: [1],
        consoleOutput: [{ id: "log-1", kind: "warning", content: `[${result.join(", ")}] (biased result)` }],
        state: { items: result },
      },
    ];
  }

  const array = [...items];
  const steps: ExecutionStep<ShuffleStepState>[] = [
    {
      id: "seed",
      title: "Starting order",
      description: `[${array.join(", ")}]`,
      activeCodeLines: [1],
      state: { items: [...array] },
    },
  ];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const before = [...array];
    if (i !== j) {
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    steps.push({
      id: `swap-${i}`,
      title: i === j ? `Pick random index for position ${i}` : `Swap positions ${i} and ${j}`,
      description:
        i === j
          ? `Random index chosen was ${j}, the same as ${i} — no visible change this round.`
          : `Random index ${j} chosen for position ${i}: swap "${before[i]}" and "${before[j]}".`,
      whyExplanation:
        "Fisher–Yates walks backward through the array once, swapping each position with a uniformly random earlier (or equal) one — this guarantees every possible ordering is equally likely.",
      activeCodeLines: [2, 3, 4],
      state: { items: [...array], swapIndices: [i, j] },
    });
  }

  steps.push({
    id: "done",
    title: "Shuffle complete",
    description: `[${array.join(", ")}]`,
    activeCodeLines: [6],
    consoleOutput: [{ id: "log-1", kind: "output", content: `[${array.join(", ")}]` }],
    state: { items: array },
  });

  return steps;
}
