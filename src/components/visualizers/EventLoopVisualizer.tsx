"use client";

import { CallStack, type CallStackFrame } from "./CallStack";
import { TaskQueue, type QueueItem } from "./TaskQueue";
import { EventLoop } from "./EventLoop";
import { cn } from "@/lib/utils";

export interface EventLoopVisualizerProps {
  callStack: CallStackFrame[];
  webApis?: QueueItem[];
  microtasks?: QueueItem[];
  macrotasks?: QueueItem[];
  loopActive?: boolean;
  showWebApis?: boolean;
  showMicrotasks?: boolean;
  showMacrotasks?: boolean;
  className?: string;
}

export function EventLoopVisualizer({
  callStack,
  webApis = [],
  microtasks = [],
  macrotasks = [],
  loopActive = false,
  showWebApis = true,
  showMicrotasks = true,
  showMacrotasks = true,
  className,
}: EventLoopVisualizerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("grid gap-3", showWebApis ? "sm:grid-cols-2" : "")}>
        <CallStack frames={callStack} />
        {showWebApis && <TaskQueue title="Web APIs" items={webApis} variant="macro" />}
      </div>
      {showMicrotasks && <TaskQueue title="Microtask Queue" items={microtasks} variant="micro" />}
      {showMacrotasks && <TaskQueue title="Task Queue" items={macrotasks} variant="macro" />}
      {(showMicrotasks || showMacrotasks) && <EventLoop active={loopActive} />}
    </div>
  );
}
