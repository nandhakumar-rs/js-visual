import type { ExecutionStep } from "@/lib/execution/types";
import { THIRD_VALUE_META, type NullUndefinedInputs, type NullUndefinedStepState } from "./types";

export function buildInitialSteps({ thirdValue }: NullUndefinedInputs): ExecutionStep<NullUndefinedStepState>[] {
  const c = THIRD_VALUE_META[thirdValue];

  return [
    {
      id: "declare",
      title: "Variables declared",
      description: 'a has no value (undefined). b is intentionally set to "nothing" (null). c holds whatever you picked.',
      whyExplanation:
        "undefined means JavaScript doesn't currently have a value here. null means a programmer deliberately placed an empty value here.",
      activeCodeLines: [1, 2, 3],
      state: { revealedTypeofs: [] },
    },
    {
      id: "typeof-a",
      title: "typeof a",
      description: "a was declared but never assigned, so its type is reported as undefined.",
      whyExplanation: "typeof a evaluates to \"undefined\" because no value was ever assigned to it.",
      activeCodeLines: [5],
      consoleOutput: [
        { id: "ta-1", kind: "command", content: "typeof a" },
        { id: "ta-2", kind: "output", content: '"undefined"' },
      ],
      state: { revealedTypeofs: ["a"] },
    },
    {
      id: "typeof-b",
      title: "typeof b",
      description: 'Even though b is null, typeof b returns "object".',
      whyExplanation:
        'typeof null === "object" is a long-standing bug in JavaScript from its very first version. null is NOT actually an object — this behavior is kept only for backwards compatibility.',
      activeCodeLines: [6],
      consoleOutput: [
        { id: "tb-1", kind: "command", content: "typeof b" },
        { id: "tb-2", kind: "output", content: '"object"' },
      ],
      state: { revealedTypeofs: ["a", "b"] },
    },
    {
      id: "typeof-c",
      title: "typeof c",
      description: `c was set to ${c.literal}, so typeof c reports "${c.typeofResult}".`,
      whyExplanation: `${c.literal} is a real, concrete value with its own type — unlike a (no value) or b (intentionally empty).`,
      activeCodeLines: [7],
      consoleOutput: [
        { id: "tc-1", kind: "command", content: "typeof c" },
        { id: "tc-2", kind: "output", content: `"${c.typeofResult}"` },
      ],
      state: { revealedTypeofs: ["a", "b", "c"] },
    },
  ];
}
