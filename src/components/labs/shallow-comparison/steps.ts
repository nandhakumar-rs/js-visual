import type { ExecutionStep } from "@/lib/execution/types";
import type { ShallowComparisonInputs, ShallowComparisonStepState } from "./types";

export function buildInitialSteps({
  nameA,
  nameB,
  shareAddressRef,
}: ShallowComparisonInputs): ExecutionStep<ShallowComparisonStepState>[] {
  const nameMatch = nameA === nameB;
  const addressMatch = shareAddressRef;

  return [
    {
      id: "seed",
      title: "a and b created",
      description: "Two objects, each with their own name and a nested address object.",
      activeCodeLines: [1, 2],
      state: { checkedKeys: [] },
    },
    {
      id: "check-name",
      title: "x.name === y.name",
      description: nameMatch
        ? `"${nameA}" === "${nameB}" → true. Primitive values are compared by value.`
        : `"${nameA}" === "${nameB}" → false.`,
      activeCodeLines: [5],
      state: { checkedKeys: ["name"], nameMatch },
    },
    {
      id: "check-address",
      title: "x.address === y.address",
      description: addressMatch
        ? "a.address and b.address point to the SAME object, so this reference comparison is true."
        : "a.address and b.address are two DIFFERENT object instances — even if their contents look identical, this reference comparison is false.",
      whyExplanation:
        "Shallow comparison stops at one level deep: it compares nested objects by reference identity, not by peeking inside them. Two structurally identical objects are still \"different\" unless they're the exact same object in memory.",
      activeCodeLines: [5],
      state: { checkedKeys: ["name", "address"], nameMatch, addressMatch },
    },
    {
      id: "result",
      title: "Result",
      description: `shallowEqual(a, b) → ${nameMatch && addressMatch}`,
      activeCodeLines: [7],
      consoleOutput: [{ id: "log-1", kind: "output", content: String(nameMatch && addressMatch) }],
      state: { checkedKeys: ["name", "address"], nameMatch, addressMatch, result: nameMatch && addressMatch },
    },
  ];
}
