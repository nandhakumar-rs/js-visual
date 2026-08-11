"use client";

import { NetworkRequest } from "@/components/visualizers/NetworkRequest";
import type { LabVisualizationProps } from "@/types/lab";
import type { ParallelAsyncInputs, ParallelAsyncStepState } from "./types";

export function ParallelAsyncVisualization({
  step,
}: LabVisualizationProps<ParallelAsyncInputs, ParallelAsyncStepState>) {
  const state = step?.state ?? { tasks: [], totalElapsed: 0 };

  return (
    <div className="space-y-3">
      {state.tasks.map((task) => (
        <NetworkRequest
          key={task.id}
          label={task.label}
          durationMs={task.durationMs}
          elapsedMs={task.status === "done" ? task.durationMs : task.status === "running" ? task.durationMs * 0.5 : 0}
          status={task.status === "done" ? "success" : "pending"}
        />
      ))}
      <p className="text-sm">
        Elapsed: <span className="font-mono font-semibold">{state.totalElapsed}ms</span>
      </p>
    </div>
  );
}
