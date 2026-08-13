"use client";

import { motion } from "motion/react";
import { PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CallStack } from "@/components/visualizers/CallStack";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { PromiseNode } from "@/components/visualizers/PromiseNode";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { TaskQueue } from "@/components/visualizers/TaskQueue";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { AsyncAwaitInputs, AsyncAwaitStepState, AwaitPhase, SuspendedFn } from "./types";

// One trip through an await, cycling: a function with two awaits goes round
// twice and nothing about the second trip differs from the first. Same cycling
// treatment as the Callback Hell, Event Loop and Microtask Queue lessons, for
// the same reason — the repetition is the teaching.
const TRIP = [
  { id: "run", label: "Runs until the next await" },
  { id: "suspend", label: "Suspended — off the stack" },
  { id: "resume", label: "Resumes as a microtask" },
];

const STAGE_FOR_PHASE: Record<AwaitPhase, string> = {
  running: "run",
  suspending: "suspend",
  waiting: "suspend",
  queued: "resume",
  resumed: "resume",
  done: "resume",
};

/**
 * The async function parked off the call stack.
 *
 * Rendered deliberately outside the CallStack rather than as a frame inside it:
 * the entire visual argument of this lesson is that a suspended function is not
 * on the stack. Written locally rather than added to the shared CallStack,
 * following the same rule as the Event Loop lesson's LoopGate and the Microtask
 * lesson's DrainGate — lesson-specific cards stay in the lesson.
 */
function SuspendedFrame({ fn }: { fn: SuspendedFn }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-2 rounded-lg border border-dashed border-amber-500/60 bg-amber-500/5 p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold">
          <PauseCircle aria-hidden className="size-3.5 text-amber-600 dark:text-amber-400" />
          {fn.label}
        </span>
        <StateBadge tone="changed">SUSPENDED</StateBadge>
      </div>

      <p className="text-[0.7rem] text-muted-foreground">
        Waiting on <span className="font-mono">{fn.awaiting}</span> · will continue from line{" "}
        <span className="font-mono">{fn.resumeLine}</span>
      </p>

      {fn.variables && fn.variables.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {fn.variables.map((v) => (
            <VariableBox
              key={v.name}
              name={v.name}
              value={v.value}
              displayValue={v.displayValue}
              status={v.status}
              size="sm"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function AsyncAwaitVisualization({
  step,
}: LabVisualizationProps<AsyncAwaitInputs, AsyncAwaitStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, callStack, suspended, awaited, microtasks, taskQueue, showTaskQueue, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={TRIP} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Await round trip" />

      <CallStack frames={callStack} />

      {suspended && <SuspendedFrame fn={suspended} />}

      {awaited && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Awaiting</span>
          <PromiseNode label={awaited.label} state={awaited.state} value={awaited.value} />
        </div>
      )}

      {/* The same sky chips as the Microtask Queue lesson, because it is the
          same queue: resuming after an await is scheduled as a microtask. */}
      <TaskQueue
        title="Microtask Queue"
        items={microtasks}
        variant="micro"
        className={cn(microtasks.length > 0 && phase === "queued" && "border-primary")}
      />

      {showTaskQueue && <TaskQueue title="Task Queue" items={taskQueue} variant="macro" />}

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
