import type { DOMNode } from "@/components/visualizers/DOMTree";

export interface SplitSentencesInputs {
  text: string;
}

export interface SplitSentencesStepState {
  root: DOMNode;
  sentenceCount: number;
}
