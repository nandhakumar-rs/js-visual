"use client";

import { DOMTree } from "@/components/visualizers/DOMTree";
import { BrowserPreview } from "@/components/visualizers/BrowserPreview";
import type { LabVisualizationProps } from "@/types/lab";
import type { HighlightInputs, HighlightStepState } from "./types";

export function HighlightVisualization({
  step,
}: LabVisualizationProps<HighlightInputs, HighlightStepState>) {
  if (!step?.state) return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;

  return (
    <div className="space-y-3">
      <BrowserPreview root={step.state.root} />
      <DOMTree root={step.state.root} />
    </div>
  );
}
