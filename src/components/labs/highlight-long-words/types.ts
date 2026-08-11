import type { DOMNode } from "@/components/visualizers/DOMTree";

export interface HighlightInputs {
  text: string;
  threshold: number;
}

export interface HighlightStepState {
  processedIndex: number;
  root: DOMNode;
}
