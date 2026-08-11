import type { ExecutionStep } from "@/lib/execution/types";
import type { DOMNode } from "@/components/visualizers/DOMTree";
import type { SplitSentencesInputs, SplitSentencesStepState } from "./types";

function containerWith(paragraphs: DOMNode[]): DOMNode {
  return { id: "container", tag: "div", attrs: { class: "container" }, children: paragraphs };
}

export function buildInitialSteps({ text }: SplitSentencesInputs): ExecutionStep<SplitSentencesStepState>[] {
  const sentences = text.split(/(?<=[.?!])\s+/).filter(Boolean);

  const steps: ExecutionStep<SplitSentencesStepState>[] = [
    {
      id: "seed",
      title: "Original text",
      description: "One block of text, before splitting.",
      activeCodeLines: [1],
      state: {
        root: containerWith([{ id: "raw", tag: "p", children: [{ id: "raw-text", tag: "#text", text }] }]),
        sentenceCount: 0,
      },
    },
  ];

  const built: DOMNode[] = [];
  sentences.forEach((sentence, i) => {
    built.push({
      id: `s-${i}`,
      tag: "p",
      isNew: true,
      isActive: i === built.length,
      children: [{ id: `s-text-${i}`, tag: "#text", text: sentence }],
    });
    steps.push({
      id: `sentence-${i}`,
      title: `Sentence ${i + 1} found`,
      description: `"${sentence}" becomes its own paragraph.`,
      activeCodeLines: [2],
      state: { root: containerWith([...built]), sentenceCount: i + 1 },
    });
  });

  steps.push({
    id: "done",
    title: "Split complete",
    description: `The text became ${sentences.length} separate sentence${sentences.length === 1 ? "" : "s"}.`,
    whyExplanation:
      "The split() regex looks for a sentence-ending punctuation mark (. ? or !) followed by whitespace, and breaks the string right after that punctuation — without deleting it.",
    activeCodeLines: [2],
    consoleOutput: [{ id: "log-1", kind: "output", content: JSON.stringify(sentences) }],
    state: { root: containerWith(built.map((p) => ({ ...p, isNew: false, isActive: false }))), sentenceCount: sentences.length },
  });

  return steps;
}
