"use client";

import { ArrayVisualizer, type ArrayItemStatus } from "@/components/visualizers/ArrayVisualizer";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import type { LabVisualizationProps } from "@/types/lab";
import type { UserExistenceInputs, UserExistenceStepState } from "./types";

export function UserExistenceVisualization({
  step,
  inputs,
}: LabVisualizationProps<UserExistenceInputs, UserExistenceStepState>) {
  const state = step?.state ?? { checkedIndices: [], matchedIndex: -1, stopped: false };
  const isResultStep = step?.id === "result";
  const currentVisitIndex = step?.id?.startsWith("visit-") ? Number(step.id.split("-")[1]) : undefined;
  const focusIndex = currentVisitIndex ?? (step?.id === "stop" ? state.matchedIndex : undefined);
  const matched = state.matchedIndex !== -1;
  const matchedUser = matched ? inputs.users[state.matchedIndex] : undefined;
  const resultVarName =
    inputs.outcome === "find" ? "foundUser" : inputs.outcome === "findIndex" ? "foundIndex" : "exists";

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">
        LOOKING FOR — <InlineCode>{JSON.stringify(inputs.searchName)}</InlineCode>
      </p>

      <ArrayVisualizer
        label="USERS"
        items={inputs.users.map((u, i) => {
          let status: ArrayItemStatus = "default";
          let sublabel = state.stopped ? "NOT CHECKED" : "WAITING";
          if (i === state.matchedIndex) {
            status = "match";
            sublabel = "MATCH FOUND";
          } else if (state.checkedIndices.includes(i)) {
            status = "reject";
            sublabel = "NOT A MATCH";
          }
          const label = inputs.outcome === "findIndex" ? `${i}. ${u.name}` : u.name;
          return { id: `u-${i}`, label, status, sublabel };
        })}
      />

      {!isResultStep && focusIndex !== undefined && focusIndex !== -1 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">CURRENT COMPARISON</p>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
            <InlineCode>{JSON.stringify(inputs.users[focusIndex].name)}</InlineCode>
            <span className="text-muted-foreground">===</span>
            <InlineCode>{JSON.stringify(inputs.searchName)}</InlineCode>
            <span className="text-muted-foreground">→</span>
            <StateBadge tone={focusIndex === state.matchedIndex ? "new" : "neutral"}>
              {String(focusIndex === state.matchedIndex)}
            </StateBadge>
          </div>
        </div>
      )}

      {isResultStep && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            RESULT — <InlineCode>{resultVarName}</InlineCode>
          </p>

          {(inputs.outcome === "some" || inputs.outcome === "forOf") && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-mono text-lg font-semibold">{String(matched)}</p>
              <StateBadge tone={matched ? "new" : "neutral"}>BOOLEAN</StateBadge>
            </div>
          )}

          {inputs.outcome === "find" &&
            (matchedUser ? (
              <ObjectVisualizer entries={[{ key: "name", displayValue: JSON.stringify(matchedUser.name) }]} isActive />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-3 text-center font-mono text-sm text-muted-foreground">
                undefined
              </div>
            ))}

          {inputs.outcome === "findIndex" && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-mono text-lg font-semibold">{matched ? state.matchedIndex : -1}</p>
              <InfoTooltip label="position">
                Array positions start counting from 0, not 1.
              </InfoTooltip>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
