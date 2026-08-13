"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CallStack } from "@/components/visualizers/CallStack";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { TaskQueue } from "@/components/visualizers/TaskQueue";
import type { LabVisualizationProps } from "@/types/lab";
import type { MicrotaskInputs, MicrotaskStepState, QueuePhase } from "./types";

// One turn of the loop, cycling: after every task the microtask queue is
// drained again. Same cycling treatment the Event Loop and Callback Hell
// lessons use, for the same reason — the repetition is the teaching.
const TURN = [
  { id: "sync", label: "Synchronous code runs on the stack" },
  { id: "drain", label: "Every microtask runs — the whole queue" },
  { id: "task", label: "Then one task from the task queue" },
];

const STAGE_FOR_PHASE: Record<QueuePhase, string> = {
  sync: "sync",
  "stack-empties": "drain",
  draining: "drain",
  "microtask-runs": "drain",
  "taking-task": "task",
  "task-runs": "task",
  done: "task",
};

/**
 * The priority check. Deliberately a different question from the Event Loop
 * lesson's LoopGate (which asks only "stack empty?"): here the answer is
 * three-way, because an empty stack is not enough — the microtask queue has to
 * be empty too before a task may run.
 *
 * Written locally rather than generalising LoopGate, following the note in
 * event-loop/EventLoopVisualization.tsx: lesson-specific gates stay in the
 * lesson, so nothing shared changes.
 */
function DrainGate({
  stackEmpty,
  microtasksEmpty,
  hasTask,
}: {
  stackEmpty: boolean;
  microtasksEmpty: boolean;
  hasTask: boolean;
}) {
  const canTakeTask = stackEmpty && microtasksEmpty && hasTask;

  return (
    <div
      className={cn(
        "space-y-1.5 rounded-lg border p-3 text-xs",
        canTakeTask ? "border-primary bg-primary/10" : "border-border bg-card/30"
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
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
        <span className="text-muted-foreground">Microtasks empty?</span>
        {microtasksEmpty ? (
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
      </div>
      <p className="text-center text-muted-foreground">
        {!stackEmpty
          ? "Code is still running — neither queue is touched."
          : !microtasksEmpty
            ? "Keep draining microtasks. The task queue waits, however long it takes."
            : hasTask
              ? "Both empty — take one task from the task queue."
              : "Nothing left to run."}
      </p>
    </div>
  );
}

export function MicrotaskVisualization({ step }: LabVisualizationProps<MicrotaskInputs, MicrotaskStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, callStack, microtasks, taskQueue, stackEmpty, drainingMicrotasks, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={TURN} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Loop turn" />

      <CallStack frames={callStack} />

      {/* The two queues, stacked in priority order: the one that always goes
          first is on top. Sky chips above violet ones. */}
      <TaskQueue
        title="Microtask Queue"
        items={microtasks}
        variant="micro"
        className={cn(drainingMicrotasks && "border-primary")}
      />
      <TaskQueue title="Task Queue" items={taskQueue} variant="macro" />

      <DrainGate
        stackEmpty={stackEmpty}
        microtasksEmpty={microtasks.length === 0}
        hasTask={taskQueue.length > 0}
      />

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
