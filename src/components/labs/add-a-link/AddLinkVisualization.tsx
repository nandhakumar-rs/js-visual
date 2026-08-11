"use client";

import { DOMTree } from "@/components/visualizers/DOMTree";
import { BrowserPreview } from "@/components/visualizers/BrowserPreview";
import type { LabVisualizationProps } from "@/types/lab";
import type { AddLinkInputs, AddLinkStepState } from "./types";

export function AddLinkVisualization({ step }: LabVisualizationProps<AddLinkInputs, AddLinkStepState>) {
  if (!step?.state) return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  const { root, detachedNode } = step.state;

  return (
    <div className="space-y-3">
      <BrowserPreview root={root} />
      <DOMTree root={root} />
      {detachedNode && (
        <div className="rounded-lg border border-dashed border-sky-500/50 bg-sky-500/5 p-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Detached node (not in the tree yet)</p>
          <DOMTree root={detachedNode} className="border-none bg-transparent p-0" />
        </div>
      )}
    </div>
  );
}
