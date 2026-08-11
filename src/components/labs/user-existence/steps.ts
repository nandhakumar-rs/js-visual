import type { ExecutionStep } from "@/lib/execution/types";
import type { UserExistenceInputs, UserExistenceStepState } from "./types";

export function buildInitialSteps({
  users,
  searchName,
  method,
}: UserExistenceInputs): ExecutionStep<UserExistenceStepState>[] {
  const matchIndex = users.findIndex((u) => u === searchName);
  const traversalLine = method === "for" ? 3 : 1;
  const steps: ExecutionStep<UserExistenceStepState>[] = [];

  const lastVisited = matchIndex === -1 ? users.length - 1 : matchIndex;

  for (let i = 0; i <= lastVisited; i++) {
    const isMatch = i === matchIndex;
    steps.push({
      id: `visit-${i}`,
      title: `Check "${users[i]}"`,
      description: isMatch
        ? `users[${i}] === "${searchName}" → true. The search can stop here.`
        : `users[${i}] === "${searchName}" → false. Keep looking.`,
      activeCodeLines: [traversalLine],
      state: { visitedIndex: i, matchedIndex: isMatch ? i : -1 },
    });
  }

  let returnValue: string;
  switch (method) {
    case "for":
      returnValue = matchIndex === -1 ? "undefined" : `"${users[matchIndex]}"`;
      break;
    case "some":
      returnValue = String(matchIndex !== -1);
      break;
    case "find":
      returnValue = matchIndex === -1 ? "undefined" : `"${users[matchIndex]}"`;
      break;
    case "findIndex":
      returnValue = String(matchIndex);
      break;
  }

  const methodLabel = {
    for: "found",
    some: "exists",
    find: "user",
    findIndex: "index",
  }[method];

  steps.push({
    id: "result",
    title: "Result",
    description: `${methodLabel} = ${returnValue}`,
    whyExplanation: methodExplanation(method, matchIndex !== -1),
    activeCodeLines: [traversalLine],
    consoleOutput: [{ id: "log-1", kind: "output", content: `${methodLabel} = ${returnValue}` }],
    state: { visitedIndex: lastVisited, matchedIndex: matchIndex, returnValue },
  });

  return steps;
}

function methodExplanation(method: UserExistenceInputs["method"], found: boolean): string {
  switch (method) {
    case "for":
      return "A manual loop gives full control — you can break early, but you're responsible for tracking the result yourself.";
    case "some":
      return "some() only tells you whether a match exists (true/false) — it doesn't hand back the matching element itself.";
    case "find":
      return found
        ? "find() returns the first matching element itself, or undefined if nothing matches."
        : "find() returns undefined because nothing matched.";
    case "findIndex":
      return found
        ? "findIndex() returns the position of the first match, or -1 if nothing matches."
        : "findIndex() returns -1 because nothing matched.";
  }
}
