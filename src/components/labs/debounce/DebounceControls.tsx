"use client";

import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Timer } from "@/components/visualizers/Timer";
import type { LabControlsProps } from "@/types/lab";
import type { DebounceInputs, DebounceStepState } from "./types";

const TICK_MS = 50;

export function DebounceControls({
  inputs,
  onInputsChange,
  engine,
}: LabControlsProps<DebounceInputs, DebounceStepState>) {
  const [value, setValue] = useState("");
  const [remainingMs, setRemainingMs] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const delayRef = useRef(inputs.delayMs);
  useEffect(() => {
    delayRef.current = inputs.delayMs;
  }, [inputs.delayMs]);

  const tip = engine.steps[engine.steps.length - 1]?.state;
  const keystrokes = tip?.keystrokes ?? 0;
  const rawCalls = tip?.rawCalls ?? 0;
  const debouncedCalls = tip?.debouncedCalls ?? 0;

  function clearTimers() {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }

  useEffect(() => clearTimers, []);

  function handleChange(nextValue: string) {
    setValue(nextValue);
    clearTimers();

    const delay = delayRef.current;
    const nextKeystrokes = keystrokes + 1;
    const nextRawCalls = rawCalls + 1;

    engine.appendStep({
      id: nanoid(),
      title: `Keystroke: "${nextValue}"`,
      description: `The input changed to "${nextValue}". Without debounce this alone would call the API immediately; with debounce, the pending timer is cleared and a new ${delay}ms one starts.`,
      whyExplanation: `Every keystroke clears any pending timer and schedules a brand new one ${delay}ms out, so the debounced call only fires once typing has stopped for a full ${delay}ms.`,
      activeCodeLines: [4, 5],
      consoleOutput: [
        { id: nanoid(), kind: "async", content: `rawOnChange("${nextValue}") → API call (no debounce)` },
        { id: nanoid(), kind: "warning", content: `"${nextValue}" → timer ${nextKeystrokes === 1 ? "started" : "reset"}` },
      ],
      state: {
        keystrokes: nextKeystrokes,
        rawCalls: nextRawCalls,
        debouncedCalls,
        timerStatus: "running",
        lastValue: nextValue,
      },
    });

    startRef.current = Date.now();
    setIsPending(true);
    setRemainingMs(delay);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setRemainingMs(Math.max(0, delay - elapsed));
    }, TICK_MS);

    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setIsPending(false);
      setRemainingMs(0);

      engine.appendStep({
        id: nanoid(),
        title: "Debounced call fires",
        description: `Typing stopped for ${delay}ms, so debouncedSearch("${nextValue}") finally runs.`,
        whyExplanation:
          "The timer was never cleared again before it completed, so its scheduled call was allowed to fire.",
        activeCodeLines: [5],
        consoleOutput: [{ id: nanoid(), kind: "async", content: `debouncedSearch("${nextValue}") → API call` }],
        state: {
          keystrokes: nextKeystrokes,
          rawCalls: nextRawCalls,
          debouncedCalls: debouncedCalls + 1,
          timerStatus: "fired",
          lastValue: nextValue,
        },
      });
    }, delay);
  }

  function handleReset() {
    clearTimers();
    setIsPending(false);
    setRemainingMs(0);
    setValue("");
    engine.reset();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="debounce-search">Search</Label>
        <Input
          id="debounce-search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type to trigger keystroke events..."
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="debounce-delay">Debounce delay</Label>
          <span className="tabular-nums text-muted-foreground">{inputs.delayMs}ms</span>
        </div>
        <Slider
          id="debounce-delay"
          min={100}
          max={1000}
          step={50}
          value={[inputs.delayMs]}
          onValueChange={(vals) => onInputsChange({ delayMs: Array.isArray(vals) ? vals[0] : vals })}
        />
      </div>

      <Timer durationMs={inputs.delayMs} remainingMs={remainingMs} isRunning={isPending} label="Debounce timer" />

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-md border border-border bg-muted/30 p-2">
          <p className="text-lg font-semibold tabular-nums">{keystrokes}</p>
          <p className="text-xs text-muted-foreground">Keystrokes</p>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-2">
          <p className="text-lg font-semibold tabular-nums">{rawCalls}</p>
          <p className="text-xs text-muted-foreground">Calls without debounce</p>
        </div>
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2">
          <p className="text-lg font-semibold tabular-nums">{debouncedCalls}</p>
          <p className="text-xs text-muted-foreground">Debounced calls</p>
        </div>
      </div>

      <Button size="sm" variant="ghost" onClick={handleReset} className="gap-1.5">
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  );
}
