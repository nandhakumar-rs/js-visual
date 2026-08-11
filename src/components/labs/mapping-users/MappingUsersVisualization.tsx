"use client";

import { ArrowRight } from "lucide-react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { MappingInputs, MappingStepState } from "./types";

export function MappingUsersVisualization({
  step,
  inputs,
}: LabVisualizationProps<MappingInputs, MappingStepState>) {
  const state = step?.state ?? { processedIds: [], result: [] };

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="users"
        items={inputs.users.map((u) => ({
          id: u.id,
          label: u.name,
          status: state.activeId === u.id ? "active" : state.processedIds.includes(u.id) ? "match" : "default",
        }))}
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowRight className="size-3.5" />
        <span className="font-mono">.map(user =&gt; user.{inputs.property})</span>
      </div>
      <ArrayVisualizer
        label="result"
        items={state.result.map((r, i) => ({ id: `r-${i}`, label: String(r), status: "added" }))}
        emptyHint="Nothing mapped yet."
      />
    </div>
  );
}
