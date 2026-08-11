"use client";

import { DOMTree } from "@/components/visualizers/DOMTree";
import { BrowserPreview } from "@/components/visualizers/BrowserPreview";
import type { LabVisualizationProps } from "@/types/lab";
import type { SplitSentencesInputs, SplitSentencesStepState } from "./types";

export function SplitSentencesVisualization({
  step,
}: LabVisualizationProps<SplitSentencesInputs, SplitSentencesStepState>) {
  if (!step?.state) return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;

  return (
    <div className="space-y-3">
      <BrowserPreview root={step.state.root} />
      <DOMTree root={step.state.root} />
    </div>
  );
}
