"use client";

import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Timer } from "@/components/visualizers/Timer";
import type { LabControlsProps } from "@/types/lab";
import type { ThrottleInputs, ThrottleStepState } from "./types";

const TICK_MS = 50;

export function ThrottleControls({
  inputs,
  onInputsChange,
  engine,
}: LabControlsProps<ThrottleInputs, ThrottleStepState>) {
  const [remainingMs, setRemainingMs] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const intervalMsRef = useRef(inputs.intervalMs);
  useEffect(() => {
    intervalMsRef.current = inputs.intervalMs;
  }, [inputs.intervalMs]);

  const tip = engine.steps[engine.steps.length - 1]?.state;
  const events = tip?.events ?? 0;
  const calls = tip?.calls ?? 0;
  const blocked = tip?.blocked ?? 0;

  function clearTimers() {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }

  useEffect(() => clearTimers, []);

  function triggerEvent() {
    const nextEvents = events + 1;

    if (isBlocked) {
      engine.appendStep({
        id: nanoid(),
        title: `Event #${nextEvents} — blocked`,
        description: "isBlocked is still true, so this call is dropped entirely — throttledHandler returns immediately.",
        whyExplanation: "Throttle guarantees at most one call per interval — every event that arrives during the cooldown is simply ignored.",
        activeCodeLines: [5],
        consoleOutput: [{ id: nanoid(), kind: "warning", content: `event #${nextEvents} → blocked` }],
        state: { events: nextEvents, calls, blocked: blocked + 1, wasBlocked: true },
      });
      return;
    }

    const interval = intervalMsRef.current;
    const nextCalls = calls + 1;

    engine.appendStep({
      id: nanoid(),
      title: `Event #${nextEvents} — call fires`,
      description: `isBlocked was false, so handleScroll() runs immediately, then isBlocked locks for ${interval}ms.`,
      whyExplanation: "The first event in a quiet period always fires immediately — throttle only starts blocking after that.",
      activeCodeLines: [7, 8, 9],
      consoleOutput: [{ id: nanoid(), kind: "async", content: `event #${nextEvents} → handleScroll() called` }],
      state: { events: nextEvents, calls: nextCalls, blocked, wasBlocked: false },
    });

    setIsBlocked(true);
    startRef.current = Date.now();
    setRemainingMs(interval);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setRemainingMs(Math.max(0, interval - elapsed));
    }, TICK_MS);
    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setIsBlocked(false);
      setRemainingMs(0);
    }, interval);
  }

  function handleReset() {
    clearTimers();
    setIsBlocked(false);
    setRemainingMs(0);
    engine.reset();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={triggerEvent} className="gap-1.5">
          <Zap className="size-4" />
          Trigger Event
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      <div className="max-w-xs space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="throttle-interval">Throttle interval</Label>
          <span className="tabular-nums text-muted-foreground">{inputs.intervalMs}ms</span>
        </div>
        <Slider
          id="throttle-interval"
          min={200}
          max={2000}
          step={100}
          value={[inputs.intervalMs]}
          onValueChange={(vals) => onInputsChange({ intervalMs: Array.isArray(vals) ? vals[0] : vals })}
        />
      </div>

      <Timer durationMs={inputs.intervalMs} remainingMs={remainingMs} isRunning={isBlocked} label="Cooldown" />
    </div>
  );
}
