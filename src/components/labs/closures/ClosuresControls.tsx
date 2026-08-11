"use client";

import { nanoid } from "nanoid";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabControlsProps } from "@/types/lab";
import type { ClosuresInputs, ClosuresStepState, CounterState } from "./types";

const LABELS = ["counterA", "counterB"];
const CREATE_LINES = [0, 1, 3, 6, 7];
const CALL_LINES = [4, 5];

export function ClosuresControls({ engine }: LabControlsProps<ClosuresInputs, ClosuresStepState>) {
  // The live simulation state is always the LAST step (the tip of the
  // timeline), not engine.currentStep — the user may be reviewing an
  // earlier step via Previous/Step without that affecting what "currently
  // exists" for the next action to build on.
  const counters: CounterState[] = engine.steps[engine.steps.length - 1]?.state?.counters ?? [];

  function createCounter() {
    if (counters.length >= LABELS.length) return;
    const label = LABELS[counters.length];
    const newCounter: CounterState = { id: label, label, count: 0 };
    const nextCounters = [...counters, newCounter];

    engine.appendStep({
      id: nanoid(),
      title: `Create ${label}`,
      description: `createCounter() runs: a new count variable is created (0) inside its own scope, and an inner function is returned that remembers it.`,
      whyExplanation: `${label} now holds a reference to the returned inner function. Even though createCounter() has finished running, that inner function keeps access to its count — that's the closure.`,
      activeCodeLines: CREATE_LINES.map((i) => i + 1),
      consoleOutput: [{ id: nanoid(), kind: "command", content: `const ${label} = createCounter();` }],
      state: { counters: nextCounters, activeCounterId: label },
    });
  }

  function callCounter(id: string) {
    const target = counters.find((c) => c.id === id);
    if (!target) return;
    const nextCount = target.count + 1;
    const nextCounters = counters.map((c) =>
      c.id === id ? { ...c, count: nextCount, previousCount: c.count } : { ...c, previousCount: undefined }
    );

    engine.appendStep({
      id: nanoid(),
      title: `Call ${id}()`,
      description: `count++ runs inside ${id}'s closure, updating its own private count from ${target.count} to ${nextCount}.`,
      whyExplanation: `Each call to createCounter() created a brand new count variable. ${id}'s closure only ever touches its own count, which is why the other counter is unaffected.`,
      activeCodeLines: CALL_LINES.map((i) => i + 1),
      consoleOutput: [
        { id: nanoid(), kind: "command", content: `${id}()` },
        { id: nanoid(), kind: "output", content: String(nextCount) },
      ],
      state: { counters: nextCounters, activeCounterId: id },
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" onClick={createCounter} disabled={counters.length >= 1}>
        Create Counter
      </Button>
      <Button size="sm" onClick={createCounter} disabled={counters.length !== 1}>
        Create Second Counter
      </Button>
      {counters.map((counter) => (
        <Button key={counter.id} size="sm" variant="secondary" onClick={() => callCounter(counter.id)}>
          Call {counter.label}()
        </Button>
      ))}
      <Button size="sm" variant="ghost" onClick={engine.reset} className="gap-1.5" disabled={counters.length === 0}>
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  );
}
