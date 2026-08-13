"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import {
  buildCode,
  DIFFER_LABEL,
  nodeCount,
  runCase,
  SIZE_LABEL,
  type DifferAt,
  type RunResult,
  type TreeSize,
} from "./experimentCode";

const SIZES: readonly TreeSize[] = ["2x2", "3x2", "3x3", "4x3"];
const WHERES: readonly DifferAt[] = ["nowhere", "first", "deepest"];

function conclusion(where: DifferAt, run: RunResult): string {
  if (where === "nowhere") {
    return `Equal objects cost one call per value: ${run.comparisons} comparisons for ${run.nodes} values, every time. That is what O(n) means here — n is the number of values, not the number of keys at the top.`;
  }
  if (where === "first") {
    return `${run.comparisons} comparisons out of ${run.nodes} possible. every() stops at the first false, so a difference in the first key costs the same two calls however big the tree gets — try a larger one.`;
  }
  return `${run.comparisons} comparisons out of ${run.nodes} — the whole tree. Short-circuiting only helps when the difference is found early, and the deepest leaf is the last thing checked.`;
}

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * The comparison count is measured by counting real recursive calls — see
 * runCase. The largest case is 121 calls, so it is instant and needs no
 * pending state.
 */
export function DeepComparisonExperiment() {
  const [size, setSize] = useState<TreeSize>("3x3");
  const [where, setWhere] = useState<DifferAt>("nowhere");
  const [run, setRun] = useState<RunResult | null>(null);

  const code = useMemo(() => buildCode(size, where), [size, where]);

  // Any control change invalidates the previous run.
  function selectSize(next: TreeSize) {
    setSize(next);
    setRun(null);
  }

  function selectWhere(next: DifferAt) {
    setWhere(next);
    setRun(null);
  }

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above. Change the size of the two trees and where they
          differ, then run it &mdash; the comparison count is the number of calls the walk actually made.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="Tree (depth × keys)"
          options={SIZES}
          value={size}
          onChange={selectSize}
          optionLabel={(option) => SIZE_LABEL[option]}
          mono
        />
        <SegmentedControl
          label="Where they differ"
          options={WHERES}
          value={where}
          onChange={selectWhere}
          optionLabel={(option) => DIFFER_LABEL[option]}
        />
      </div>

      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={code} title="Generated code" />
        </div>

        <div className="min-w-0">
          {!run ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">
                How many comparisons will {nodeCount(size)} values take?
              </p>
              <p className="text-xs text-muted-foreground">Predict it, then run the walk and compare.</p>
              <Button
                type="button"
                size="sm"
                onClick={() => setRun(runCase(size, where))}
                className="w-full @md:w-auto"
              >
                Run it
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${size}-${where}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone="changed">
                  {run.comparisons} OF {run.nodes}
                </StateBadge>
                <span className="text-xs text-muted-foreground">calls made, measured just now</span>
              </div>

              <dl className="space-y-1">
                {[
                  { term: "Values in the tree", value: String(run.nodes) },
                  { term: "Calls to deepEqual", value: String(run.comparisons) },
                  { term: "Result", value: String(run.result) },
                ].map((row) => (
                  <div
                    key={row.term}
                    className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1"
                  >
                    <dt className="text-xs text-muted-foreground">{row.term}</dt>
                    <dd className="ml-auto font-mono text-xs">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-sm text-muted-foreground">{conclusion(where, run)}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
