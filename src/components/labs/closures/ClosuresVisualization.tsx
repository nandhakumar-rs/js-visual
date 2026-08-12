"use client";

import { ArrowRight } from "lucide-react";
import { InlineCode } from "@/components/learning/InlineCode";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { ScopeBox } from "@/components/visualizers/ScopeBox";
import type { StateBadgeTone } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type {
  ClosureBox,
  ClosurePhase,
  ClosuresInputs,
  ClosuresStepState,
  ClosureStatus,
  ClosureVarEntry,
} from "./types";

// The whole lesson turns on the middle step: the call ends and the scope does
// not. Showing the lifecycle as three fixed stages makes that moment visible
// rather than something the learner has to infer from the code panel.
const LIFECYCLE = [
  { id: "runs", label: "createCounter() runs" },
  { id: "ends", label: "It returns and the call ends" },
  { id: "alive", label: "count is still alive" },
];

// Four tracked phases collapse onto three displayed stages: entering the call
// and running it are one beat to the learner.
const STAGE_FOR_PHASE: Record<ClosurePhase, string> = {
  "before-call": "runs",
  "call-running": "runs",
  "call-finished": "ends",
  "using-closure": "alive",
};

const CLOSURE_BADGE: Record<ClosureStatus, { text: string; tone: StateBadgeTone }> = {
  creating: { text: "BEING CREATED", tone: "new" },
  retained: { text: "RETAINED — CALL HAS FINISHED", tone: "neutral" },
  updating: { text: "COUNT UPDATED", tone: "changed" },
  // Amber, not destructive: being unreachable from outside is the closure
  // working as intended. The ReferenceError itself is rendered below in
  // destructive text, where it belongs.
  unreachable: { text: "PRIVATE — NOT REACHABLE FROM HERE", tone: "changed" },
};

function toVariables(vars: ClosureVarEntry[]) {
  return vars.map((v) => ({ name: v.name, displayValue: v.displayValue, status: v.status }));
}

function ClosureScope({ closure, isActive }: { closure: ClosureBox; isActive: boolean }) {
  return (
    <ScopeBox
      label={closure.label}
      kind="closure"
      isActive={isActive}
      statusBadge={CLOSURE_BADGE[closure.status]}
      variables={[
        {
          name: "count",
          value: closure.count,
          previousValue: closure.previousCount,
          status: closure.previousCount !== undefined ? "updated" : "set",
        },
      ]}
    />
  );
}

export function ClosuresVisualization({ step }: LabVisualizationProps<ClosuresInputs, ClosuresStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { closures, activeClosureId, failedRead } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={LIFECYCLE} currentId={STAGE_FOR_PHASE[state.phase]} ariaLabel="Closure lifecycle" />

      <ScopeBox
        label="Global"
        kind="global"
        isActive={!activeClosureId && !state.factoryOpen}
        statusBadge={failedRead ? { text: "SEARCHING — NOTHING FURTHER OUT", tone: "changed" } : undefined}
        variables={toVariables(state.globalVars)}
      >
        {state.factoryOpen && (
          <ScopeBox
            label="createCounter()"
            kind="function"
            isActive
            statusBadge={{ text: "RUNNING", tone: "new" }}
            variables={toVariables(state.factoryVars)}
            emptyHint={state.factoryVars.length === 0 ? "No local variables yet." : undefined}
          />
        )}

        {closures.length > 0 && (
          <div className="space-y-2">
            {closures.map((closure) => (
              <ClosureScope key={closure.id} closure={closure} isActive={closure.id === activeClosureId} />
            ))}
          </div>
        )}
      </ScopeBox>

      {failedRead && (
        <div className="space-y-1.5 rounded-lg border border-border/60 bg-card/30 p-3 text-xs">
          <p className="flex flex-wrap items-center gap-1.5">
            <InlineCode>{failedRead.variable}</InlineCode>
            <ArrowRight aria-hidden className="size-3 text-muted-foreground" />
            {failedRead.searched.map((scope) => (
              <span key={scope} className="text-muted-foreground">
                {scope}
              </span>
            ))}
            <span className="text-muted-foreground">&middot; not found</span>
          </p>
          <p className="text-muted-foreground">
            The search never looks inward, so the <InlineCode>count</InlineCode> held by the closure is never
            considered.
          </p>
        </div>
      )}
    </div>
  );
}
