import type { ExecutionStep } from "@/lib/execution/types";
import { CHAIN, type PrototypesInputs, type PrototypesStepState } from "./types";

export function buildInitialSteps({ property }: PrototypesInputs): ExecutionStep<PrototypesStepState>[] {
  const steps: ExecutionStep<PrototypesStepState>[] = [];
  const checked: string[] = [];
  let foundAt: string | undefined;

  for (const level of CHAIN) {
    const hasIt = level.ownProps.includes(property);
    checked.push(level.id);
    steps.push({
      id: `check-${level.id}`,
      title: `${level.label}.${property}?`,
      description: hasIt
        ? `${property} found directly on ${level.label} ✅`
        : `${property} not found on ${level.label} ❌ — check its [[Prototype]] next.`,
      activeCodeLines: [13],
      state: { checkedLevelIds: [...checked], foundAtLevelId: hasIt ? level.id : undefined, reachedNull: false },
    });
    if (hasIt) {
      foundAt = level.id;
      break;
    }
  }

  if (!foundAt) {
    steps.push({
      id: "null",
      title: "Reached the end of the chain: null",
      description: `Object.prototype's [[Prototype]] is null — the search stops, and maya.${property} is undefined.`,
      whyExplanation:
        "Every prototype chain eventually ends at null. If a property isn't found anywhere along the chain, the result is undefined — not an error.",
      activeCodeLines: [13],
      consoleOutput: [{ id: "log-1", kind: "output", content: "undefined" }],
      state: { checkedLevelIds: [...checked], reachedNull: true },
    });
  } else {
    const level = CHAIN.find((l) => l.id === foundAt)!;
    steps.push({
      id: "result",
      title: "Property resolved",
      description: `maya.${property} resolves to the ${property} found on ${level.label}.`,
      activeCodeLines: [13],
      consoleOutput: [{ id: "log-1", kind: "output", content: `found on ${level.label}` }],
      state: { checkedLevelIds: checked, foundAtLevelId: foundAt, reachedNull: false },
    });
  }

  return steps;
}
