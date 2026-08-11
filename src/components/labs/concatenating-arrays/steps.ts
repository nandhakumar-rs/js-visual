import type { ExecutionStep } from "@/lib/execution/types";
import type { ConcatArraysInputs, ConcatArraysStepState, ConcatResultItem } from "./types";

export function buildInitialSteps({ a, b, mode }: ConcatArraysInputs): ExecutionStep<ConcatArraysStepState>[] {
  const call = mode === "concat" ? "a.concat(b)" : "[...a, ...b]";
  const aItems: ConcatResultItem[] = a.map((value) => ({ value, source: "a" as const }));
  const bItems: ConcatResultItem[] = b.map((value) => ({ value, source: "b" as const }));
  const allItems = [...aItems, ...bItems];
  const flat = [...a, ...b];

  return [
    {
      id: "seed",
      title: "Two source arrays",
      description: "`a` and `b` have been created. We have not joined them yet.",
      activeCodeLines: [1, 2],
      state: { a, b, result: [] },
    },
    {
      id: "result-created",
      title: "A new result array is created",
      description: `\`${call}\` creates a new array to hold the combined result — \`a\` and \`b\` are not touched.`,
      activeCodeLines: [3],
      state: { a, b, result: [] },
    },
    {
      id: "add-a",
      title: "Items from a are added first",
      description: "The items from `a` are placed into the result first, in order.",
      activeCodeLines: [3],
      state: { a, b, result: aItems },
    },
    {
      id: "add-b",
      title: "Items from b are added next",
      description: "Then the items from `b` are added after them, completing the order `a` then `b`.",
      activeCodeLines: [3],
      state: { a, b, result: allItems },
    },
    {
      id: "comparison",
      title: "result holds both arrays in order",
      description: `\`result\` now holds \`a\`'s items followed by \`b\`'s items. \`a\` and \`b\` still contain their original items, unchanged.`,
      activeCodeLines: [3, 5],
      consoleOutput: [
        { id: "log-1", kind: "command", content: "console.log(a, b, result)" },
        { id: "log-2", kind: "output", content: `[${a.join(", ")}] [${b.join(", ")}] [${flat.join(", ")}]` },
      ],
      state: { a, b, result: allItems },
    },
  ];
}
