import type { ExecutionStep } from "@/lib/execution/types";
import type { UserExistenceInputs, UserExistenceStepState } from "./types";

const PREDICATE_LINE = 2; // some()/find()/findIndex() shared shape
const FOR_OF_IF_LINE = 4;
const FOR_OF_MATCH_LINES = [4, 5, 6];

function resultDescription(outcome: UserExistenceInputs["outcome"], matched: boolean, name: string, index: number): string {
  switch (outcome) {
    case "some":
      return `exists = ${matched}`;
    case "find":
      return matched ? `foundUser = { name: "${name}" }` : "foundUser = undefined";
    case "findIndex":
      return `foundIndex = ${matched ? index : -1}`;
    case "forOf":
      return `exists = ${matched}`;
  }
}

export function buildInitialSteps({
  users,
  searchName,
  outcome,
}: UserExistenceInputs): ExecutionStep<UserExistenceStepState>[] {
  const matchIndex = users.findIndex((u) => u.name === searchName);
  const lastVisited = matchIndex === -1 ? users.length - 1 : matchIndex;
  const activeCodeLines = outcome === "forOf" ? [FOR_OF_IF_LINE] : [PREDICATE_LINE];

  const steps: ExecutionStep<UserExistenceStepState>[] = [];
  const checkedIndices: number[] = [];

  for (let i = 0; i <= lastVisited; i++) {
    const user = users[i];
    const isMatch = i === matchIndex;
    if (!isMatch) checkedIndices.push(i);

    steps.push({
      id: `visit-${i}`,
      title: `Check "${user.name}"`,
      description: isMatch
        ? `"${user.name}" === "${searchName}" → true. The search can stop here.`
        : `"${user.name}" === "${searchName}" → false. Keep looking.`,
      activeCodeLines: isMatch && outcome === "forOf" ? FOR_OF_MATCH_LINES : activeCodeLines,
      state: { checkedIndices: [...checkedIndices], matchedIndex: isMatch ? i : -1, stopped: false },
    });
  }

  const hasEarlyStop = matchIndex !== -1 && matchIndex < users.length - 1;
  if (hasEarlyStop) {
    steps.push({
      id: "stop",
      title: "Search stops here",
      description: "One match is enough. The search stops here.",
      activeCodeLines: outcome === "forOf" ? FOR_OF_MATCH_LINES : activeCodeLines,
      state: { checkedIndices: [...checkedIndices], matchedIndex: matchIndex, stopped: true },
    });
  }

  const resultDesc = resultDescription(outcome, matchIndex !== -1, searchName, matchIndex);
  steps.push({
    id: "result",
    title: "Result",
    description: resultDesc,
    activeCodeLines: outcome === "forOf" ? [1] : [1],
    consoleOutput: [{ id: "log-1", kind: "output", content: resultDesc }],
    state: { checkedIndices: [...checkedIndices], matchedIndex: matchIndex, stopped: hasEarlyStop },
  });

  return steps;
}
