import type { ExecutionStep } from "@/lib/execution/types";
import type { MappingInputs, MappingStepState } from "./types";

export function buildInitialSteps({ users, property }: MappingInputs): ExecutionStep<MappingStepState>[] {
  const resultLine = users.length + 4;
  const steps: ExecutionStep<MappingStepState>[] = [
    {
      id: "seed",
      title: "users array created",
      description: `An array of ${users.length} user objects is ready to be mapped.`,
      whyExplanation: "map() hasn't run yet — nothing has been transformed.",
      activeCodeLines: Array.from({ length: users.length + 2 }, (_, i) => i + 1),
      state: { processedIds: [], result: [] },
    },
  ];

  const result: (string | number)[] = [];
  users.forEach((user, i) => {
    result.push(user[property]);
    steps.push({
      id: `visit-${user.id}`,
      title: `${user.name} enters .map()`,
      description: `The callback runs with user = ${user.name}, returning user.${property} (${JSON.stringify(user[property])}).`,
      whyExplanation:
        "map() calls the callback once per element, in order, and collects whatever each call returns into a new array — the original users array is never touched.",
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
    title: "map() returns the new array",
    description: `.map() finishes and returns [${result.map((r) => JSON.stringify(r)).join(", ")}].`,
    whyExplanation: "Every element was visited exactly once, and the collected return values form the new array.",
    activeCodeLines: [resultLine],
    consoleOutput: [
      { id: "log-1", kind: "command", content: `users.map(user => user.${property})` },
      { id: "log-2", kind: "output", content: `[${result.map((r) => JSON.stringify(r)).join(", ")}]` },
    ],
    state: { processedIds: users.map((u) => u.id), result: [...result] },
  });

  return steps;
}
