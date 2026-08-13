"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type {
  CallbackPhase,
  CallbacksInputs,
  CallbacksStepState,
  CallerStatus,
  ReceiverStatus,
} from "./types";

// The lesson is about a handoff, so the strip tracks the handoff rather than
// anything about scopes or queues: you give a function away, someone else does
// work, and eventually your function is run for you.
const HANDOFF = [
  { id: "pass", label: "You hand over a function" },
  { id: "work", label: "The other function does its work" },
  { id: "back", label: "Your function is called back" },
];

// Five tracked phases collapse onto three displayed stages: handing the
// function over and it being held are one beat to the learner, as are the
// callback running and the program finishing.
const STAGE_FOR_PHASE: Record<CallbackPhase, string> = {
  "handing-over": "pass",
  held: "pass",
  working: "work",
  "calling-back": "back",
  done: "back",
};

/** Which card the action is in — only one is outlined at a time. */
const ACTIVE_CARD: Record<CallbackPhase, "caller" | "receiver" | "invocation"> = {
  "handing-over": "caller",
  held: "caller",
  working: "receiver",
  "calling-back": "invocation",
  done: "invocation",
};

const CALLER_BADGE: Record<CallerStatus, { text: string; tone: StateBadgeTone }> = {
  running: { text: "RUNNING", tone: "new" },
  // Amber: "moved on" is the surprising part of the lesson, not a failure.
  "moved-on": { text: "MOVED ON — NOT WAITING", tone: "changed" },
  finished: { text: "FINISHED", tone: "neutral" },
};

const RECEIVER_BADGE: Record<ReceiverStatus, { text: string; tone: StateBadgeTone }> = {
  idle: { text: "NOT CALLED YET", tone: "neutral" },
  holding: { text: "HOLDING YOUR FUNCTION", tone: "neutral" },
  working: { text: "WORK IN PROGRESS", tone: "new" },
  calling: { text: "CALLING YOU BACK", tone: "new" },
  returned: { text: "ALREADY RETURNED", tone: "neutral" },
};

/**
 * One participant in the handoff.
 *
 * Deliberately not ScopeBox: this lesson never makes a claim about scope, and
 * borrowing that container would assert a nesting relationship that isn't
 * being taught. It reuses StateBadge and VariableBox so the visual language
 * still matches the rest of the app.
 */
function HandoffCard({
  label,
  badge,
  isActive,
  hint,
  children,
}: {
  label: string;
  badge: { text: string; tone: StateBadgeTone };
  isActive: boolean;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-lg border bg-card/50 p-3",
        isActive ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border"
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{label}</span>
        <StateBadge tone={badge.tone}>{badge.text}</StateBadge>
      </div>
      {children}
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

export function CallbacksVisualization({ step }: LabVisualizationProps<CallbacksInputs, CallbacksStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, receiverName, parameterName, calledWith, failed, note } = state;
  const active = ACTIVE_CARD[phase];
  const handedOver = phase !== "handing-over";

  return (
    <div className="space-y-3">
      <PhaseStrip stages={HANDOFF} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Callback handoff" />

      <HandoffCard
        label="Your code"
        badge={CALLER_BADGE[state.callerStatus]}
        isActive={active === "caller"}
        hint={handedOver ? undefined : "The function exists, but has not been handed to anyone yet."}
      >
        {handedOver && (
          <div className="flex flex-wrap gap-2">
            <VariableBox name="handed over" displayValue="ƒ" status="set" size="sm" />
          </div>
        )}
      </HandoffCard>

      <HandoffCard
        label={receiverName}
        badge={RECEIVER_BADGE[state.receiverStatus]}
        isActive={active === "receiver"}
        hint={handedOver ? `The same function, under the name ${receiverName} chose for it.` : undefined}
      >
        {handedOver && (
          <div className="flex flex-wrap gap-2">
            <VariableBox name={parameterName} displayValue="ƒ" status="set" size="sm" />
          </div>
        )}
      </HandoffCard>

      {calledWith && (
        <HandoffCard
          label="Your function runs"
          badge={
            failed
              ? { text: "CALLED WITH AN ERROR", tone: "error" }
              : { text: "CALLED WITH", tone: "success" }
          }
          isActive={active === "invocation"}
          hint="These arrived as arguments — not as a return value."
        >
          <div className="flex flex-wrap gap-2">
            {calledWith.map((arg) => (
              <VariableBox
                key={arg.name}
                name={arg.name}
                displayValue={arg.displayValue}
                status={arg.status}
                size="sm"
              />
            ))}
          </div>
        </HandoffCard>
      )}

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
