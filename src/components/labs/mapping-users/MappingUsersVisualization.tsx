"use client";

import { ArrowDown } from "lucide-react";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import { TransformationLane } from "@/components/visualizers/TransformationLane";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { MappingInputs, MappingStepState } from "./types";

export function MappingUsersVisualization({
  step,
  inputs,
}: LabVisualizationProps<MappingInputs, MappingStepState>) {
  const state = step?.state ?? { processedIds: [], result: [] };
  const activeUser = inputs.users.find((u) => u.id === state.activeId);

  if (step?.id === "done") {
    const resultTypeLabel = inputs.property === "name" ? "strings" : "numbers";
    const resultTypeLabelCap = inputs.property === "name" ? "Strings" : "Numbers";

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            ORIGINAL — <InlineCode>users</InlineCode>
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
              UNCHANGED
            </span>
          </p>
          <div className="space-y-2">
            {inputs.users.map((u) => (
              <ObjectVisualizer
                key={u.id}
                label={u.name}
                entries={[
                  { key: "name", displayValue: JSON.stringify(u.name) },
                  { key: "age", displayValue: String(u.age) },
                ]}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
          <span className="rounded bg-primary/10 px-2 py-1 font-mono text-xs text-primary">
            .map(user =&gt; user.{inputs.property})
          </span>
          <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            NEW — <InlineCode>result</InlineCode>
            <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-sky-600 dark:text-sky-400">
              NEW
            </span>
          </p>
          <div className="rounded-lg border border-sky-500/40 bg-sky-500/5 p-3">
            <p className="break-words font-mono text-sm">
              [
              {state.result.map((r, i) => (
                <span key={i}>
                  <span className="text-emerald-600 dark:text-emerald-400">{JSON.stringify(r)}</span>
                  {i < state.result.length - 1 && <span className="text-muted-foreground">, </span>}
                </span>
              ))}
              ]
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Array of {resultTypeLabel}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3 text-center text-sm">
          <p>
            <InlineCode>Objects</InlineCode> → <InlineCode>{resultTypeLabelCap}</InlineCode>
          </p>
          <p className="text-xs text-muted-foreground">
            <InlineCode>users</InlineCode> stayed unchanged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ArrayVisualizer
        label="ORIGINAL ARRAY"
        items={inputs.users.map((u) => ({
          id: u.id,
          label: u.name,
          status: state.activeId === u.id ? "active" : state.processedIds.includes(u.id) ? "match" : "default",
        }))}
      />

      {activeUser && (
        <TransformationLane
          stepKey={activeUser.id}
          input={
            <ObjectVisualizer
              entries={[
                { key: "name", displayValue: JSON.stringify(activeUser.name) },
                { key: "age", displayValue: String(activeUser.age) },
              ]}
              isActive
            />
          }
          expression={`user.${inputs.property}`}
          output={
            <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-sm text-emerald-700 dark:text-emerald-400">
              {JSON.stringify(activeUser[inputs.property])}
            </span>
          }
        />
      )}

      <ArrayVisualizer
        label="NEW ARRAY"
        badge="NEW"
        items={state.result.map((r, i) => ({ id: `r-${i}`, label: String(r), status: "added" }))}
        emptyHint="Nothing mapped yet."
      />
    </div>
  );
}
