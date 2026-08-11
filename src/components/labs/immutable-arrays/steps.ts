import type { ExecutionStep } from "@/lib/execution/types";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export function buildInitialSteps({
  newValue,
  mode,
}: ImmutableArrayInputs): ExecutionStep<ImmutableArrayStepState>[] {
  const base = [1, 2, 3];
  const pushed = [...base, newValue];
  const updated = [...base, newValue];

  const pushSteps: ExecutionStep<ImmutableArrayStepState>[] = [
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

  const spreadSteps: ExecutionStep<ImmutableArrayStepState>[] = [
    {
      id: "spread-seed",
      title: "Now, without changing the original",
      description: `Now let's add \`${newValue}\` without changing the original array.`,
      whyExplanation: "This time we'll create a new array instead of mutating the old one.",
      activeCodeLines: [6],
      state: { phase: "spread-seed", array: base, original: base },
    },
    {
      id: "spread-run",
      title: `[...original, ${newValue}]`,
      description: `\`...original\` copies the existing items into a new array, then \`${newValue}\` is added after them.`,
      whyExplanation:
        "Spreading into a new array literal creates a brand new array object — `original` itself is never touched.",
      activeCodeLines: [7],
      state: { phase: "spread-done", array: base, original: base, updated },
    },
    {
      id: "spread-log",
      title: "console.log(original, updated)",
      description: `\`original\` is still \`[${base.join(", ")}]\`; \`updated\` is \`[${updated.join(", ")}]\`.`,
      whyExplanation: "Two separate arrays now exist — the old one, untouched, and a new one with the added value.",
      activeCodeLines: [8],
      consoleOutput: [
        { id: "spread-log-1", kind: "command", content: "console.log(original, updated)" },
        { id: "spread-log-2", kind: "output", content: `[${base.join(", ")}] [${updated.join(", ")}]` },
      ],
      state: { phase: "spread-done", array: base, original: base, updated },
    },
  ];

  if (mode === "push") return pushSteps;
  if (mode === "spread") return spreadSteps;

  return [
    ...pushSteps,
    ...spreadSteps,
    {
      id: "comparison",
      title: "push() vs. spread — side by side",
      description: "`push()` changed the same array. Spread created a new one and left the original alone.",
      whyExplanation: "If the old array must stay unchanged, create a new array instead of mutating the existing one.",
      activeCodeLines: [3, 4, 7, 8],
      state: { phase: "comparison", array: pushed, original: base, updated },
    },
  ];
}
