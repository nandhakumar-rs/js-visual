"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { MemoizationInputs, MemoizationStepState } from "./types";

export function MemoizationControls({ engine }: LabControlsProps<MemoizationInputs, MemoizationStepState>) {
  const [value, setValue] = useState(5);

  const tip = engine.steps[engine.steps.length - 1]?.state ?? {
    cache: [],
    calls: 0,
    calculations: 0,
    cacheHits: 0,
  };

  function handleCall() {
    const n = value;
    const existing = tip.cache.find((c) => c.input === n);
    const nextCalls = tip.calls + 1;

    if (existing) {
      engine.appendStep({
        id: nanoid(),
        title: `slowCalculation(${n}) — cache HIT`,
        description: `cache.has(${n}) is true, so the stored result (${existing.result}) is returned instantly — no recalculation.`,
        whyExplanation: "This is the entire point of memoization: repeated calls with the same input skip the expensive work entirely.",
        activeCodeLines: [3, 4],
        consoleOutput: [{ id: nanoid(), kind: "output", content: `slowCalculation(${n}) → ${existing.result} (cached)` }],
        state: {
          cache: tip.cache,
          calls: nextCalls,
          calculations: tip.calculations,
          cacheHits: tip.cacheHits + 1,
          lastInput: n,
          wasHit: true,
        },
      });
      return;
    }

    const result = n * 3;
    engine.appendStep({
      id: nanoid(),
      title: `slowCalculation(${n}) — cache MISS`,
      description: `cache.has(${n}) is false, so the result is calculated (${n} × 3 = ${result}) and stored for next time.`,
      activeCodeLines: [7, 8],
      consoleOutput: [{ id: nanoid(), kind: "output", content: `slowCalculation(${n}) → ${result} (calculated)` }],
      state: {
        cache: [...tip.cache, { input: n, result }],
        calls: nextCalls,
        calculations: tip.calculations + 1,
        cacheHits: tip.cacheHits,
        lastInput: n,
        wasHit: false,
      },
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-24 space-y-1">
        <Label htmlFor="memo-input">n</Label>
        <Input
          id="memo-input"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
        />
      </div>
      <Button size="sm" onClick={handleCall} className="gap-1.5">
        <Play className="size-4" />
        Call slowCalculation({value})
      </Button>
      <Button size="sm" variant="ghost" onClick={engine.reset} className="gap-1.5">
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  );
}
