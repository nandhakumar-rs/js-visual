"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { buildCase, measureOnce, type BlockMs, type DelayMs, type Measurement } from "./experimentCode";

const BLOCKS: readonly BlockMs[] = ["0", "50", "200", "800"];
const DELAYS: readonly DelayMs[] = ["0", "100", "500"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * The numbers are measured by running the generated program, not calculated.
 */
export function EventLoopExperiment() {
  const [block, setBlock] = useState<BlockMs>("800");
  const [delay, setDelay] = useState<DelayMs>("0");
  const [result, setResult] = useState<Measurement | null>(null);
  const [measuring, setMeasuring] = useState(false);

  const current = useMemo(() => buildCase(block, delay), [block, delay]);

  // Any control change invalidates the previous measurement.
  function selectBlock(next: BlockMs) {
    setBlock(next);
    setResult(null);
  }

  function selectDelay(next: DelayMs) {
    setDelay(next);
    setResult(null);
  }

  function handleMeasure() {
    setMeasuring(true);
    // Yield first so React paints the "Measuring…" state before the thread is
    // blocked — otherwise the button would appear frozen with no explanation.
    setTimeout(async () => {
      const measurement = await measureOnce(current.blockMs, current.requestedMs);
      setResult(measurement);
      setMeasuring(false);
    }, 0);
  }

  const stats = result
    ? [
        { label: "Delay requested", value: `${current.requestedMs}ms` },
        { label: "Actual delay", value: `${result.actualMs}ms` },
        { label: "Late by", value: `${result.lateByMs}ms` },
        { label: "Ran after the block", value: result.ranAfterBlock ? "yes" : "no" },
      ]
    : [];

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above. This one really runs: the numbers are measured in your
          browser, so at 800ms the page will briefly stutter — which is the whole point.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="Blocking work on the stack"
          options={BLOCKS}
          value={block}
          onChange={selectBlock}
          optionLabel={(option) => `${option}ms`}
          mono
        />
        <SegmentedControl
          label="Delay you ask for"
          options={DELAYS}
          value={delay}
          onChange={selectDelay}
          optionLabel={(option) => `${option}ms`}
          mono
        />
      </div>

      {/* Both columns start directly with their panel, so their tops line up.
          The code panel carries its own "Generated code" title bar instead of
          an external label. */}
      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={current.code} activeLines={[current.readLine]} title="Generated code" />
        </div>

        <div className="min-w-0">
          {!result ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">How late will the callback actually be?</p>
              <p className="text-xs text-muted-foreground">
                Predict it, then run the program and compare.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleMeasure}
                disabled={measuring}
                className="w-full @md:w-auto"
              >
                {measuring ? "Measuring…" : "Run it and measure"}
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${block}-${delay}-${result.actualMs}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={result.lateByMs > 20 ? "changed" : "success"}>
                  {result.lateByMs > 20 ? `LATE BY ~${result.lateByMs}MS` : "ON TIME"}
                </StateBadge>
                <span className="text-xs text-muted-foreground">measured just now</span>
              </div>

              <dl className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-border/60 bg-card/40 px-2 py-1.5">
                    <dt className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
                    <dd className="font-mono text-sm font-semibold tabular-nums">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-sm text-muted-foreground">
                {result.ranAfterBlock
                  ? "The stack was busy past the moment the timer finished, so the callback sat in the queue until the blocking work ended. The delay you asked for was only a floor."
                  : "The timer outlasted the blocking work, so the stack was already free when it finished — and the callback ran roughly on time."}
              </p>

              <Button type="button" size="sm" variant="outline" onClick={handleMeasure} disabled={measuring}>
                {measuring ? "Measuring…" : "Run again"}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
