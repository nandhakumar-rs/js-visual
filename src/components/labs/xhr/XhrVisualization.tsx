"use client";

import { NetworkRequest } from "@/components/visualizers/NetworkRequest";
import type { LabVisualizationProps } from "@/types/lab";
import type { XhrInputs, XhrStepState } from "./types";

export function XhrVisualization({ step }: LabVisualizationProps<XhrInputs, XhrStepState>) {
  const state = step?.state ?? { stage: "idle", elapsedMs: 0, totalMs: 1200 };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Legacy API — useful to understand, but Fetch is preferred for most modern code.
      </p>
      <NetworkRequest
        label="GET /users"
        durationMs={state.totalMs}
        elapsedMs={state.elapsedMs}
        status={state.stage === "done" ? (state.succeeded ? "success" : "error") : "pending"}
      />
      <p className="text-sm text-muted-foreground">
        readyState: <span className="font-mono text-foreground">{stageToReadyState(state.stage)}</span>
      </p>
    </div>
  );
}

function stageToReadyState(stage: XhrStepState["stage"]): string {
  switch (stage) {
    case "idle":
      return "UNSENT (0)";
    case "created":
      return "UNSENT (0)";
    case "opened":
      return "OPENED (1)";
    case "sending":
      return "LOADING (3)";
    case "done":
      return "DONE (4)";
  }
}
