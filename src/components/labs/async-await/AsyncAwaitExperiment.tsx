"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import {
  buildCase,
  runCase,
  START_LABEL,
  STEP_MS,
  type RunResult,
  type StartStyle,
  type StepCount,
} from "./experimentCode";

const STEP_COUNTS: readonly StepCount[] = ["2", "3", "4"];
const STARTS: readonly StartStyle[] = ["one-at-a-time", "all-at-once"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * Every number shown comes from the run that just happened — nothing here is
 * predicted from the step count.
 */
export function AsyncAwaitExperiment() {
  const [steps, setSteps] = useState<StepCount>("3");
  const [start, setStart] = useState<StartStyle>("one-at-a-time");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const current = useMemo(() => buildCase(steps, start), [steps, start]);

  // Any control change invalidates the previous run.
  function selectSteps(next: StepCount) {
    setSteps(next);
    setResult(null);
  }

  function selectStart(next: StartStyle) {
    setStart(next);
    setResult(null);
  }

  async function handleRun() {
    setRunning(true);
    setResult(await runCase(current.steps, current.start));
    setRunning(false);
  }

  const slowest = result ? Math.max(...result.marks.map((m) => m.atMs)) : 0;

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above. Each step takes {STEP_MS}ms and none of them needs a
          previous result. Run it and read the clock &mdash; the timings are measured in your browser, not
          calculated.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[2fr_3fr]">
        <SegmentedControl
          label="Steps"
          options={STEP_COUNTS}
          value={steps}
          onChange={selectSteps}
          optionLabel={(option) => option}
          mono
        />
        <SegmentedControl
          label="How they are started"
          options={STARTS}
          value={start}
          onChange={selectStart}
          optionLabel={(option) => START_LABEL[option]}
        />
      </div>

      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={current.code} title="Generated code" />
        </div>

        <div className="min-w-0">
          {!result ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">How long will all {current.steps} steps take?</p>
              <p className="text-xs text-muted-foreground">Predict it, then run the program and compare.</p>
              <Button
                type="button"
                size="sm"
                onClick={handleRun}
                disabled={running}
                className="w-full @md:w-auto"
              >
                {running ? "Running…" : "Run it"}
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${steps}-${start}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={start === "all-at-once" ? "success" : "changed"}>
                  TOOK {result.totalMs} MS
                </StateBadge>
                <span className="text-xs text-muted-foreground">measured just now</span>
              </div>

              <ol className="space-y-1">
                {result.marks.map((mark) => (
                  <li
                    key={mark.label}
                    className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1"
                  >
                    <span className="font-mono text-xs">{mark.label}</span>
                    <span className="ml-auto font-mono text-[0.7rem] text-muted-foreground">
                      arrived at {mark.atMs}ms
                    </span>
                  </li>
                ))}
              </ol>

              <p className="text-sm text-muted-foreground">
                {start === "one-at-a-time"
                  ? `Each await starts its step only after the previous one finished, so the times add up — ${current.steps} steps of ${STEP_MS}ms.`
                  : `Every step was started before anything was awaited, so they overlapped: all ${current.steps} arrived by ${slowest}ms — the time of the slowest one, not the sum.`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
