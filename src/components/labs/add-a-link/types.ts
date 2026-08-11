import type { DOMNode } from "@/components/visualizers/DOMTree";

export interface AddLinkInputs {
  href: string;
  text: string;
}

export interface AddLinkStepState {
  root: DOMNode;
  detachedNode?: DOMNode;
}
