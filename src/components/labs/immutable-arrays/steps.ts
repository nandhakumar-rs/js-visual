import type { ExecutionStep } from "@/lib/execution/types";
import type { ValuesRefInputs, ValuesRefStepState } from "./types";

function formatArray(values: number[]): string {
  return `[${values.join(", ")}]`;
}

export function buildInitialSteps({
  startingArray,
  newValue,
  mode,
}: ValuesRefInputs): ExecutionStep<ValuesRefStepState>[] {
  const original = startingArray;
  const originalLiteral = formatArray(original);

  if (mode === "share-mutate") {
    const mutated = [...original, newValue];
    const mutatedLiteral = formatArray(mutated);

    return [
      {
        id: "share-create-original",
        title: "Create the original array",
        description: `\`original\` leads to \`${originalLiteral}\`.`,
        whyExplanation: "Nothing has run yet — this is just the starting array.",
        activeCodeLines: [1],
        state: { phase: "share-create-original", original, connector: "none" },
      },
      {
        id: "share-create-alias",
        title: "Create `alias`",
        description: "`alias` receives the same reference used by `original`.",
        whyExplanation:
          "Assigning `original` to `alias` copies the reference value, not a new array — both names now lead to the same array.",
        activeCodeLines: [2],
        state: {
          phase: "share-create-alias",
          original,
          companion: original,
          companionLabel: "alias",
          connector: "shared",
        },
      },
      {
        id: "share-identity",
        title: "Same array, two names",
        description: "Both `original` and `alias` lead to one array.",
        whyExplanation: "There is only one array in memory here — `original` and `alias` are just two names for it.",
        activeCodeLines: [1, 2],
        state: {
          phase: "share-identity",
          original,
          companion: original,
          companionLabel: "alias",
          companionBadge: { text: "SAME ARRAY", tone: "neutral" },
          connector: "shared",
        },
      },
      {
        id: "share-mutate",
        title: `alias.push(${newValue})`,
        description: `\`.push()\` adds \`${newValue}\` directly to the array \`alias\` points to.`,
        whyExplanation: "`push()` mutates the array it's called on — no new array is created.",
        activeCodeLines: [4],
        state: {
          phase: "share-mutate",
          original: mutated,
          companion: mutated,
          companionLabel: "alias",
          companionBadge: { text: "MUTATION — SAME ARRAY CHANGED", tone: "changed" },
          connector: "shared",
          newIndexRevealed: true,
        },
      },
      {
        id: "share-after",
        title: "Both variables see the change",
        description: `\`original\` and \`alias\` both now lead to \`${mutatedLiteral}\`.`,
        whyExplanation:
          "`alias` never received a second array — mutating through it changes the one array `original` also leads to.",
        activeCodeLines: [4],
        state: {
          phase: "share-after",
          original: mutated,
          companion: mutated,
          companionLabel: "alias",
          companionBadge: { text: "SAME ARRAY CHANGED", tone: "changed" },
          connector: "shared",
          newIndexRevealed: true,
        },
      },
      {
        id: "share-log-original",
        title: 'console.log("original:", original)',
        description: `Logging \`original\` shows it now includes the added value: \`${mutatedLiteral}\`.`,
        whyExplanation:
          "`original` and `alias` lead to the same array, so the mutation made through `alias` shows up here too.",
        activeCodeLines: [6],
        consoleOutput: [
          { id: "share-log-original-cmd", kind: "command", content: 'console.log("original:", original)' },
          { id: "share-log-original-out", kind: "output", content: `original: ${mutatedLiteral}` },
        ],
        state: {
          phase: "share-log-original",
          original: mutated,
          companion: mutated,
          companionLabel: "alias",
          companionBadge: { text: "SAME ARRAY CHANGED", tone: "changed" },
          connector: "shared",
          newIndexRevealed: true,
        },
      },
      {
        id: "share-log-alias",
        title: 'console.log("alias:", alias)',
        description: "No second array was created — `alias` reveals the exact same mutated array.",
        whyExplanation:
          "`alias = original` copies the reference value, so mutating through `alias` mutates the exact array `original` points to.",
        activeCodeLines: [7],
        consoleOutput: [
          { id: "share-log-alias-cmd", kind: "command", content: 'console.log("alias:", alias)' },
          { id: "share-log-alias-out", kind: "output", content: `alias: ${mutatedLiteral}` },
        ],
        state: {
          phase: "share-log-alias",
          original: mutated,
          companion: mutated,
          companionLabel: "alias",
          companionBadge: { text: "SAME ARRAY MUTATED", tone: "changed" },
          connector: "shared",
          newIndexRevealed: true,
        },
      },
    ];
  }

  const updated = [...original, newValue];
  const updatedLiteral = formatArray(updated);

  return [
    {
      id: "copy-create-original",
      title: "Create the original array",
      description: `\`original\` leads to \`${originalLiteral}\`.`,
      whyExplanation: "Nothing has run yet — this is just the starting array.",
      activeCodeLines: [1],
      state: { phase: "copy-create-original", original, connector: "none" },
    },
    {
      id: "copy-read-items",
      title: "Read the existing items",
      description: "`...original` reads each item out of `original`, one by one.",
      whyExplanation: "Spread doesn't touch `original` — it only reads its items to copy them elsewhere.",
      activeCodeLines: [2],
      state: {
        phase: "copy-read-items",
        original,
        originalActive: true,
        connector: "separate",
        companionEmptyHint: "Reading items from original…",
      },
    },
    {
      id: "copy-add-value",
      title: `Add ${newValue}`,
      description: `After copying the existing items, \`${newValue}\` is placed after them.`,
      whyExplanation: "The new value is added after the copied items, inside the new array literal.",
      activeCodeLines: [2],
      state: {
        phase: "copy-add-value",
        original,
        companion: updated,
        companionLabel: "updated",
        connector: "separate",
        newIndexRevealed: true,
      },
    },
    {
      id: "copy-create-new",
      title: "Create the new array",
      description: `\`updated\` receives \`${updatedLiteral}\`.`,
      whyExplanation: "The array literal `[...original, value]` builds a brand new array object.",
      activeCodeLines: [2],
      state: {
        phase: "copy-create-new",
        original,
        companion: updated,
        companionLabel: "updated",
        companionBadge: { text: "NEW ARRAY CREATED", tone: "new" },
        connector: "separate",
        newIndexRevealed: true,
      },
    },
    {
      id: "copy-compare",
      title: "Compare the final state",
      description: `\`original\` is still \`${originalLiteral}\`; \`updated\` is \`${updatedLiteral}\`.`,
      whyExplanation: "Two separate arrays now exist — the old one, untouched, and a new one with the added value.",
      activeCodeLines: [1, 2],
      state: {
        phase: "copy-compare",
        original,
        originalBadge: { text: "ORIGINAL — UNCHANGED", tone: "neutral" },
        companion: updated,
        companionLabel: "updated",
        companionBadge: { text: "NEW ARRAY CREATED", tone: "new" },
        connector: "separate",
        newIndexRevealed: true,
      },
    },
    {
      id: "copy-log-original",
      title: 'console.log("original:", original)',
      description: `Logging \`original\` confirms it was never touched: still \`${originalLiteral}\`.`,
      whyExplanation: "`[...original, value]` only reads from `original` — it never modifies it.",
      activeCodeLines: [4],
      consoleOutput: [
        { id: "copy-log-original-cmd", kind: "command", content: 'console.log("original:", original)' },
        { id: "copy-log-original-out", kind: "output", content: `original: ${originalLiteral}` },
      ],
      state: {
        phase: "copy-log-original",
        original,
        originalBadge: { text: "ORIGINAL — UNCHANGED", tone: "neutral" },
        companion: updated,
        companionLabel: "updated",
        companionBadge: { text: "NEW ARRAY CREATED", tone: "new" },
        connector: "separate",
        newIndexRevealed: true,
      },
    },
    {
      id: "copy-log-updated",
      title: 'console.log("updated:", updated)',
      description: `\`updated\` holds the new array with the added value: \`${updatedLiteral}\`.`,
      whyExplanation: "`updated` is a separate array object — `original` keeps its own identity and contents.",
      activeCodeLines: [5],
      consoleOutput: [
        { id: "copy-log-updated-cmd", kind: "command", content: 'console.log("updated:", updated)' },
        { id: "copy-log-updated-out", kind: "output", content: `updated: ${updatedLiteral}` },
      ],
      state: {
        phase: "copy-log-updated",
        original,
        originalBadge: { text: "ORIGINAL — UNCHANGED", tone: "neutral" },
        companion: updated,
        companionLabel: "updated",
        companionBadge: { text: "NEW ARRAY CREATED", tone: "new" },
        connector: "separate",
        newIndexRevealed: true,
      },
    },
  ];
}
