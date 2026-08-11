import type { ExecutionStep } from "@/lib/execution/types";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export function buildInitialSteps({
  newValue,
  mode,
}: ImmutableArrayInputs): ExecutionStep<ImmutableArrayStepState>[] {
  const base = [1, 2, 3];

  if (mode === "push") {
    const pushed = [...base, newValue];
    return [
      {
        id: "push-seed",
        title: "We start with one array",
        description: "We start with `array`, holding `[1, 2, 3]`.",
        whyExplanation: "Nothing has run yet — this is just the starting array.",
        activeCodeLines: [1],
        state: { phase: "push-seed", array: base, original: base },
      },
      {
        id: "push-run",
        title: `array.push(${newValue})`,
        description: `\`push()\` adds \`${newValue}\` directly to the existing array.`,
        whyExplanation: "`push()` mutates the array it's called on — no new array is created.",
        activeCodeLines: [3],
        state: { phase: "push-done", array: pushed, original: base },
      },
      {
        id: "push-log",
        title: "console.log(array)",
        description: "The original array itself changed.",
        whyExplanation:
          "Because `push()` mutated `array` in place, logging `array` now shows the new item too.",
        activeCodeLines: [4],
        consoleOutput: [
          { id: "push-log-1", kind: "command", content: "console.log(array)" },
          { id: "push-log-2", kind: "output", content: `[${pushed.join(", ")}]` },
        ],
        state: { phase: "push-done", array: pushed, original: base },
      },
    ];
  }

  const updated = [...base, newValue];
  return [
    {
      id: "spread-seed",
      title: "We start with one array",
      description: "We start with `original`, holding `[1, 2, 3]`.",
      whyExplanation: "Nothing has run yet — this is just the starting array.",
      activeCodeLines: [1],
      state: { phase: "spread-seed", array: base, original: base },
    },
    {
      id: "spread-run",
      title: `[...original, ${newValue}]`,
      description: `\`...original\` copies the existing items into a new array, then \`${newValue}\` is added after them.`,
      whyExplanation:
        "Spreading into a new array literal creates a brand new array object — `original` itself is never touched.",
      activeCodeLines: [3],
      state: { phase: "spread-done", array: base, original: base, updated },
    },
    {
      id: "spread-log",
      title: "console.log(original, updated)",
      description: `\`original\` is still \`[${base.join(", ")}]\`; \`updated\` is \`[${updated.join(", ")}]\`.`,
      whyExplanation: "Two separate arrays now exist — the old one, untouched, and a new one with the added value.",
      activeCodeLines: [4],
      consoleOutput: [
        { id: "spread-log-1", kind: "command", content: "console.log(original, updated)" },
        { id: "spread-log-2", kind: "output", content: `[${base.join(", ")}] [${updated.join(", ")}]` },
      ],
      state: { phase: "spread-done", array: base, original: base, updated },
    },
  ];
}
