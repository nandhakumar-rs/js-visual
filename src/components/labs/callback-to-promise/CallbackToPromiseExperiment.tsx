"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { InlineCodeText } from "@/components/learning/InlineCodeText";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { buildCase, SHAPE_LABEL, type Shape, type StepCount } from "./experimentCode";

const COUNTS: readonly StepCount[] = ["2", "3", "4", "5"];
const SHAPES: readonly Shape[] = ["callbacks", "promises"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * It settles the claim the Callback Hell lesson made about this one, using the
 * same generator and the same measurements.
 */
export function CallbackToPromiseExperiment() {
  const [count, setCount] = useState<StepCount>("3");
  const [shape, setShape] = useState<Shape>("callbacks");
  const [revealed, setRevealed] = useState(false);

  const current = useMemo(() => buildCase(count, shape), [count, shape]);

  // Any control change invalidates the previous answer: the numbers and their
  // explanation go away together.
  function selectCount(next: StepCount) {
    setCount(next);
    setRevealed(false);
  }

  function selectShape(next: Shape) {
    setShape(next);
    setRevealed(false);
  }

  const stats = [
    { label: "Nesting depth", value: String(current.metrics.depth) },
    { label: "Error handlers", value: String(current.metrics.errorHandlers) },
    { label: "Lines", value: String(current.metrics.lines) },
    { label: "Chain starts on line", value: String(current.metrics.chainStartLine) },
  ];

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above — the same dependent steps written both ways. Add steps and
          watch which numbers grow.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="Steps in the chain"
          options={COUNTS}
          value={count}
          onChange={selectCount}
          optionLabel={(option) => option}
          mono
        />
        <SegmentedControl
          label="How it is written"
          options={SHAPES}
          value={shape}
          onChange={selectShape}
          optionLabel={(option) => SHAPE_LABEL[option]}
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
          {!revealed ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">How deep does it go, and how many error handlers?</p>
              <p className="text-xs text-muted-foreground">
                Make your prediction, then check it against the generated code.
              </p>
              <Button type="button" size="sm" onClick={() => setRevealed(true)} className="w-full @md:w-auto">
                Check result
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${count}-${shape}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={shape === "callbacks" ? "changed" : "success"}>{current.badge}</StateBadge>
                {/* The chain is never shorter than two steps, so "steps" is always plural. */}
                <span className="text-xs text-muted-foreground">
                  {count} steps, {SHAPE_LABEL[shape].toLowerCase()}
                </span>
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
                <InlineCodeText text={current.explanation} />
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
