import type { ExecutionStep } from "@/lib/execution/types";
import type { MappingInputs, MappingStepState } from "./types";

export function buildInitialSteps({ users, property }: MappingInputs): ExecutionStep<MappingStepState>[] {
  const resultLine = users.length + 4;
  const steps: ExecutionStep<MappingStepState>[] = [
    {
      id: "seed",
      title: "The array is ready",
      description: "Three user objects are sitting in the `users` array, waiting to be mapped.",
      whyExplanation: "`.map()` hasn't run yet, so nothing has been transformed.",
      activeCodeLines: Array.from({ length: users.length + 2 }, (_, i) => i + 1),
      state: { processedIds: [], result: [] },
    },
  ];

  const result: (string | number)[] = [];
  users.forEach((user, i) => {
    result.push(user[property]);
    steps.push({
      id: `visit-${user.id}`,
      title: `${user.name} goes through .map()`,
      description: `The function you give \`.map()\` runs with \`user\` set to ${user.name}, and returns \`user.${property}\` (${JSON.stringify(user[property])}).`,
      whyExplanation:
        "`.map()` calls the function you gave it once per element, in order, and collects whatever it returns into a new array — the original `users` array is never touched.",
      activeCodeLines: [resultLine],
      state: {
        processedIds: users.slice(0, i + 1).map((u) => u.id),
        activeId: user.id,
        result: [...result],
      },
    });
  });

  steps.push({
    id: "done",
    title: ".map() returns the new array",
    description: `\`.map()\` visited every user, took the \`${property}\`, and collected those values into a new array.`,
    whyExplanation:
      "The original `users` array still contains the same user objects — `.map()` only reads them, it never changes them.",
    activeCodeLines: [resultLine],
    state: { processedIds: users.map((u) => u.id), result: [...result] },
  });

  return steps;
}
