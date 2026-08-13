"use client";

import { ArrowDown, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CallStack } from "@/components/visualizers/CallStack";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { TaskQueue } from "@/components/visualizers/TaskQueue";
import { Timer } from "@/components/visualizers/Timer";
import type { LabVisualizationProps } from "@/types/lab";
import type { EventLoopInputs, EventLoopStepState, LoopPhase, WebApiTask } from "./types";

// Composed from the shared CallStack and TaskQueue rather than from
// EventLoopVisualizer: that component's layout and titles are fixed, and its
// EventLoop child is a decorative spinner with no phase state — it cannot show
// the "is the stack empty?" check, which is the whole point of this lesson.
// Composing here also means nothing shared changes, so fetch is unaffected.
const LOOP = [
  { id: "stack", label: "Your code runs on the call stack" },
  { id: "outside", label: "Waiting work sits outside it" },
  { id: "back", label: "The loop moves it back when the stack is empty" },
];

// Seven tracked phases collapse onto three displayed stages, and they cycle:
// every queued task goes round the same loop.
const STAGE_FOR_PHASE: Record<LoopPhase, string> = {
  "running-sync": "stack",
  waiting: "outside",
  queued: "outside",
  "loop-blocked": "outside",
  "loop-moves": "back",
  "callback-runs": "back",
  done: "back",
};

/** The browser's side of the handoff — deliberately outside the stack. */
function WebApiCard({ tasks }: { tasks: WebApiTask[] }) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Web APIs</p>
        <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">the browser, off the stack</span>
      </div>
      {tasks.length > 0 ? (
        <div className="flex min-h-10 flex-wrap items-center gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <Timer
                variant="ring"
                durationMs={task.durationMs}
                remainingMs={task.remainingMs}
                isRunning={task.remainingMs > 0}
              />
              <span className="font-mono text-xs text-muted-foreground">{task.label}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="flex min-h-10 items-center text-xs text-muted-foreground italic">Empty</p>
      )}
    </div>
  );
}

/**
 * The check itself: is the stack empty, and is anything queued? Nothing in the
 * shared visualizer kit can express this, and it is the answer to "what decides
 * when a setTimeout callback actually runs".
 */
function LoopGate({ stackEmpty, hasQueued }: { stackEmpty: boolean; hasQueued: boolean }) {
  const canMove = stackEmpty && hasQueued;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 rounded-lg border p-3 text-xs",
        canMove ? "border-primary bg-primary/10" : "border-border bg-card/30"
      )}
    >
      <span className="font-semibold">Event loop</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">Stack empty?</span>
      {stackEmpty ? (
        <StateBadge tone="success">
          <Check aria-hidden className="mr-0.5 inline size-3" />
          YES
        </StateBadge>
      ) : (
        <StateBadge tone="changed">
          <X aria-hidden className="mr-0.5 inline size-3" />
          NO
        </StateBadge>
      )}
      <span className="text-muted-foreground">
        {canMove ? (
          <>
            &mdash; take the first task <ArrowDown aria-hidden className="inline size-3 rotate-180" />
          </>
        ) : stackEmpty ? (
          "— nothing queued, nothing to do"
        ) : (
          "— the loop waits, however long that takes"
        )}
      </span>
    </div>
  );
}

export function EventLoopVisualization({ step }: LabVisualizationProps<EventLoopInputs, EventLoopStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, callStack, webApis, taskQueue, stackEmpty, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={LOOP} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Event loop" />

      <CallStack frames={callStack} />
      <WebApiCard tasks={webApis} />
      <TaskQueue title="Task Queue" items={taskQueue} variant="macro" />
      <LoopGate stackEmpty={stackEmpty} hasQueued={taskQueue.length > 0} />

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
