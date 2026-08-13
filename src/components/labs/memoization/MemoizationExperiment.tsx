"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import {
  buildCode,
  DISTINCT_LABEL,
  runCase,
  TOTAL_CALLS,
  type Distinct,
  type RunResult,
} from "./experimentCode";

const DISTINCTS: readonly Distinct[] = ["5", "50", "500", "1000"];

function conclusion(distinct: Distinct, run: RunResult): string {
  if (run.hits === 0) {
    return `Every call missed. The cache did no work for you at all, and it is still holding ${run.entries} entries that nothing will ever remove — this is the case where memoizing is strictly worse than not bothering.`;
  }
  if (run.hitRate >= 90) {
    return `${run.entries} stored entries served ${run.hits} of ${TOTAL_CALLS} calls. A small cache carrying a heavy repeat rate is exactly where memoization earns its keep.`;
  }
  return `Half the calls hit and half missed, so the cache saved ${run.hits} calculations while holding ${run.entries} entries. The benefit scales with repeats; the memory cost scales with distinct inputs.`;
}

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props.
 *
 * It is also where this lesson's interactivity lives. The lab this replaced was
 * `mode: "interactive"` and let the learner call the function by hand; the
 * guided layout has no gated try-it step, so the hands-on surface is here.
 */
export function MemoizationExperiment() {
  const [distinct, setDistinct] = useState<Distinct>("50");
  const [run, setRun] = useState<RunResult | null>(null);

  const code = useMemo(() => buildCode(distinct), [distinct]);

  // Any control change invalidates the previous run.
  function selectDistinct(next: Distinct) {
    setDistinct(next);
    setRun(null);
  }

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above. {TOTAL_CALLS} calls every time &mdash; the only thing
          that changes is how many distinct inputs arrive. The counts come from really running the loop.
        </p>
      </div>

      <SegmentedControl
        label="Distinct inputs"
        options={DISTINCTS}
        value={distinct}
        onChange={selectDistinct}
        optionLabel={(option) => DISTINCT_LABEL[option]}
        mono
      />

      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={code} activeLines={[5]} title="Generated code" />
        </div>

        <div className="min-w-0">
          {!run ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">
                How many of the {TOTAL_CALLS} calls will hit the cache?
              </p>
              <p className="text-xs text-muted-foreground">Predict it, then run the loop and compare.</p>
              <Button
                type="button"
                size="sm"
                onClick={() => setRun(runCase(distinct))}
                className="w-full @md:w-auto"
              >
                Run it
              </Button>
            </div>
          ) : (
            <motion.div
              key={distinct}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={run.hits === 0 ? "error" : "success"}>
                  {run.hitRate}% HIT RATE
                </StateBadge>
                <span className="text-xs text-muted-foreground">counted just now</span>
              </div>

              <dl className="space-y-1">
                {[
                  { term: "Calls", value: String(TOTAL_CALLS) },
                  { term: "Cache hits", value: String(run.hits) },
                  { term: "Calculations", value: String(run.misses) },
                  { term: "Entries kept in memory", value: String(run.entries) },
                ].map((r) => (
                  <div
                    key={r.term}
                    className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1"
                  >
                    <dt className="text-xs text-muted-foreground">{r.term}</dt>
                    <dd className="ml-auto font-mono text-xs">{r.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-sm text-muted-foreground">{conclusion(distinct, run)}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
