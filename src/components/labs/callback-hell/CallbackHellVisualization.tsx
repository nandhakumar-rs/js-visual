"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InlineCode } from "@/components/learning/InlineCode";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type {
  CallbackHellInputs,
  CallbackHellStepState,
  HellPhase,
  PipelineStep,
  StepStatus,
} from "./types";

// Three beats produce one level of nesting, and then they run again for the
// next step. The strip deliberately CYCLES rather than advancing once: the
// learner watches the same loop twice (two-steps) or four times (four-steps)
// while the depth readout climbs, which is exactly the point being made.
const NESTING_LOOP = [
  { id: "call", label: "A step is called" },
  { id: "result", label: "Its result arrives inside a callback" },
  { id: "nest", label: "So the next call goes inside it" },
];

const STAGE_FOR_PHASE: Record<HellPhase, string> = {
  calling: "call",
  "result-arrives": "result",
  "nesting-deeper": "nest",
  done: "nest",
  // A failure is a result arriving — an unwelcome one.
  failed: "result",
};

const STATUS_BADGE: Record<StepStatus, { text: string; tone: StateBadgeTone }> = {
  waiting: { text: "WAITING", tone: "neutral" },
  running: { text: "RUNNING", tone: "new" },
  done: { text: "DONE", tone: "success" },
  failed: { text: "FAILED", tone: "error" },
  "never-ran": { text: "NEVER RAN", tone: "neutral" },
};

/**
 * One level of the chain, rendering the next level inside itself.
 *
 * Deliberately not ScopeBox — following the note in CallbacksVisualization,
 * the nesting here is callback nesting, not a scope claim. Box-in-box is the
 * point: the shape on screen is the shape of the code beside it.
 */
function NestedCallbackCard({ steps, index }: { steps: PipelineStep[]; index: number }) {
  const current = steps[index];
  if (!current) return null;

  const badge = STATUS_BADGE[current.status];
  const isDim = current.status === "waiting" || current.status === "never-ran";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "min-w-0 rounded-lg border p-3",
        current.status === "running" && "border-primary bg-card/50 shadow-[0_0_0_1px_var(--primary)]",
        current.status === "failed" && "border-destructive/60 bg-destructive/5",
        current.status === "done" && "border-border bg-card/50",
        isDim && "border-dashed border-border/60 bg-card/20"
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className={cn("font-mono text-xs font-semibold", isDim && "text-muted-foreground")}>
          {current.label}
        </span>
        <span className="flex flex-wrap items-center gap-1.5">
          <StateBadge tone={badge.tone}>{badge.text}</StateBadge>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            Level {current.depth}
          </span>
        </span>
      </div>

      {current.hasErrorCheck && (
        <p
          className={cn(
            "mb-2 font-mono text-[0.7rem]",
            current.errorCaught ? "font-semibold text-destructive" : "text-muted-foreground/70"
          )}
        >
          if (error) …{current.errorCaught ? "  ← this one fired" : ""}
        </p>
      )}

      {current.produced && (
        <VariableBox
          name={current.produced.name}
          displayValue={current.produced.displayValue}
          status={current.status === "failed" ? "error" : "set"}
          size="sm"
        />
      )}

      {index + 1 < steps.length && (
        <div className="mt-3 border-t border-border/60 pt-3">
          <NestedCallbackCard steps={steps} index={index + 1} />
        </div>
      )}
    </motion.div>
  );
}

export function CallbackHellVisualization({
  step,
}: LabVisualizationProps<CallbackHellInputs, CallbackHellStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, steps, depth, errorChecks, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={NESTING_LOOP} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Nesting loop" />

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2">
        <span className="text-xs text-muted-foreground">Nesting depth</span>
        <StateBadge tone={depth >= 3 ? "changed" : "neutral"}>{depth}</StateBadge>
        {errorChecks !== undefined && (
          <>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {errorChecks} identical <InlineCode>if (error)</InlineCode> checks
            </span>
          </>
        )}
      </div>

      <NestedCallbackCard steps={steps} index={0} />

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
