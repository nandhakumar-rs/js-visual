"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ConsoleEntry, ExecutionStep } from "./types";

export type EngineStatus = "idle" | "playing" | "paused" | "finished";
export type EngineSpeed = 0.5 | 1 | 2;

const DEFAULT_STEP_DURATION_MS = 1400;

export interface ExecutionEngine<TState = Record<string, unknown>> {
  steps: ExecutionStep<TState>[];
  currentIndex: number;
  currentStep: ExecutionStep<TState> | undefined;
  status: EngineStatus;
  speed: EngineSpeed;
  isFirst: boolean;
  isLast: boolean;
  consoleEntries: ConsoleEntry[];
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: EngineSpeed) => void;
  replaceSteps: (steps: ExecutionStep<TState>[]) => void;
  appendStep: (step: ExecutionStep<TState>, autoAdvance?: boolean) => void;
}

export interface UseExecutionEngineOptions<TState> {
  steps: ExecutionStep<TState>[];
  defaultStepDurationMs?: number;
}

export function useExecutionEngine<TState = Record<string, unknown>>(
  opts: UseExecutionEngineOptions<TState>
): ExecutionEngine<TState> {
  const { defaultStepDurationMs = DEFAULT_STEP_DURATION_MS } = opts;

  const [steps, setSteps] = useState<ExecutionStep<TState>[]>(opts.steps);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Only tracks whether auto-advance (Play) is engaged. The publicly exposed
  // `status` below is derived from this + currentIndex/steps.length, so
  // "reached the end" never needs its own setState call inside an effect.
  const [isPlayingFlag, setIsPlayingFlag] = useState(false);
  const [speed, setSpeedState] = useState<EngineSpeed>(1);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialStepsRef = useRef<ExecutionStep<TState>[]>(opts.steps);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const isLastIndex = useCallback(
    (idx: number) => steps.length === 0 || idx >= steps.length - 1,
    [steps.length]
  );

  const status: EngineStatus = useMemo(() => {
    if (steps.length === 0) return "idle";
    if (currentIndex >= steps.length - 1) return "finished";
    if (isPlayingFlag) return "playing";
    return currentIndex === 0 ? "idle" : "paused";
  }, [steps.length, currentIndex, isPlayingFlag]);

  const goTo = useCallback(
    (index: number) => {
      clearTimer();
      setIsPlayingFlag(false);
      setCurrentIndex(Math.max(0, Math.min(index, Math.max(steps.length - 1, 0))));
    },
    [clearTimer, steps.length]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const previous = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (isLastIndex(currentIndex)) {
      setCurrentIndex(0);
    }
    setIsPlayingFlag(true);
  }, [steps.length, currentIndex, isLastIndex]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlayingFlag(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsPlayingFlag(false);
    setSteps(initialStepsRef.current);
    setCurrentIndex(0);
  }, [clearTimer]);

  const setSpeed = useCallback((s: EngineSpeed) => setSpeedState(s), []);

  const replaceSteps = useCallback(
    (newSteps: ExecutionStep<TState>[]) => {
      clearTimer();
      initialStepsRef.current = newSteps;
      setIsPlayingFlag(false);
      setSteps(newSteps);
      setCurrentIndex(0);
    },
    [clearTimer]
  );

  const appendStep = useCallback(
    (step: ExecutionStep<TState>, autoAdvance = true) => {
      clearTimer();
      setIsPlayingFlag(false);
      setSteps((prev) => {
        const merged = [...prev, step];
        if (autoAdvance) setCurrentIndex(merged.length - 1);
        return merged;
      });
    },
    [clearTimer]
  );

  // Drives Play/Run: chained setTimeout (not setInterval) so each step can
  // carry its own durationMs (e.g. a debounce "timer running" step waits
  // longer than an instant scope-creation step), scaled by playback speed.
  // Reaching the last step simply stops scheduling further ticks — `status`
  // above already reports "finished" once currentIndex hits the end.
  useEffect(() => {
    if (!isPlayingFlag) return;
    if (isLastIndex(currentIndex)) return;
    const step = steps[currentIndex];
    const duration = (step?.durationMs ?? defaultStepDurationMs) / speed;
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
    }, duration);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayingFlag, currentIndex, speed, steps, defaultStepDurationMs]);

  const consoleEntries = useMemo(() => {
    const entries: ConsoleEntry[] = [];
    for (let i = 0; i <= currentIndex && i < steps.length; i++) {
      const output = steps[i]?.consoleOutput;
      if (output) entries.push(...output);
    }
    return entries;
  }, [steps, currentIndex]);

  return {
    steps,
    currentIndex,
    currentStep: steps[currentIndex],
    status,
    speed,
    isFirst: currentIndex <= 0,
    isLast: isLastIndex(currentIndex),
    consoleEntries,
    next,
    previous,
    goTo,
    play,
    pause,
    reset,
    setSpeed,
    replaceSteps,
    appendStep,
  };
}
