import type { ExecutionStep } from "@/lib/execution/types";
import type { DOMNode } from "@/components/visualizers/DOMTree";
import type { HighlightInputs, HighlightStepState } from "./types";

function buildRoot(words: string[], decided: (DOMNode | string)[], pendingStartIndex: number): DOMNode {
  const children: DOMNode[] = [];
  decided.forEach((entry, i) => {
    if (i > 0) children.push({ id: `sep-${i}`, tag: "#text", text: " " });
    if (typeof entry === "string") {
      children.push({ id: `w-${i}`, tag: "#text", text: entry });
    } else {
      children.push(entry);
    }
  });

  const remaining = words.slice(pendingStartIndex);
  if (remaining.length > 0) {
    if (decided.length > 0) children.push({ id: "sep-rest", tag: "#text", text: " " });
    children.push({ id: "rest", tag: "#text", text: remaining.join(" ") });
  }

  return { id: "p", tag: "p", children };
}

export function buildInitialSteps({ text, threshold }: HighlightInputs): ExecutionStep<HighlightStepState>[] {
  const words = text.split(" ").filter(Boolean);
  const steps: ExecutionStep<HighlightStepState>[] = [
    {
      id: "seed",
      title: "Text split into words",
      description: `${words.length} words to inspect, one at a time.`,
      activeCodeLines: [1, 2],
      state: { processedIndex: -1, root: buildRoot(words, [], 0) },
    },
  ];

  const decided: (DOMNode | string)[] = [];
  words.forEach((word, i) => {
    const isLong = word.length > threshold;
    decided.push(
      isLong
        ? {
            id: `mark-${i}`,
            tag: "mark",
            isNew: true,
            children: [{ id: `mark-text-${i}`, tag: "#text", text: word }],
          }
        : word
    );
    steps.push({
      id: `word-${i}`,
      title: `"${word}" (${word.length} chars)`,
      description: isLong
        ? `${word.length} > ${threshold}, so it gets wrapped in <mark>.`
        : `${word.length} is not longer than ${threshold}, so it's left as plain text.`,
      activeCodeLines: [5],
      state: { processedIndex: i, root: buildRoot(words, [...decided], i + 1) },
    });
  });

  steps.push({
    id: "done",
    title: "Highlighting complete",
    description: "Every word has been checked and the paragraph is rebuilt with <mark> tags where needed.",
    activeCodeLines: [4, 5, 6],
    state: { processedIndex: words.length - 1, root: buildRoot(words, decided, words.length) },
  });

  return steps;
}
