"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { ComparisonRow } from "./ShallowComparisonVisualization";
import { buildCode, BUILD_LABEL, runCase, type BuildStyle } from "./experimentCode";
import type { Comparison } from "./types";

const BUILDS: readonly BuildStyle[] = ["alias", "spread", "literal", "clone"];

const CONCLUSION: Record<BuildStyle, string> = {
  alias: "Nothing was created, so every check agrees. This is the only build where === says true.",
  spread:
    "The interesting one: === says false because b is a new object, but the shallow check says true — it compared the nested address by a reference that spread copied rather than recreated.",
  literal: "Every object is new, so only the JSON comparison — which reads contents, not identities — says true.",
  clone:
    "Identical to the plain literal. To these checks a deep clone is just another object, which is rarely what people expect of structuredClone.",
};

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * Every cell is produced by really evaluating the expression — see runCase.
 */
export function ShallowComparisonExperiment() {
  const [style, setStyle] = useState<BuildStyle>("spread");
  const [results, setResults] = useState<Comparison[] | null>(null);

  const code = useMemo(() => buildCode(style), [style]);

  // Any control change invalidates the previous run.
  function selectStyle(next: BuildStyle) {
    setStyle(next);
    setResults(null);
  }

  const trueCount = results ? results.filter((r) => r.result).length : 0;

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above. Change how <span className="font-mono">b</span> is
          built, then run the four comparisons &mdash; the answers you get back are evaluated for real, not
          looked up.
        </p>
      </div>

      <SegmentedControl
        label="How b is built"
        options={BUILDS}
        value={style}
        onChange={selectStyle}
        optionLabel={(option) => BUILD_LABEL[option]}
        mono
      />

      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={code} activeLines={[2]} title="Generated code" />
        </div>

        <div className="min-w-0">
          {!results ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">Which of the four are true?</p>
              <p className="text-xs text-muted-foreground">Predict it, then run them and compare.</p>
              <Button type="button" size="sm" onClick={() => setResults(runCase(style))} className="w-full @md:w-auto">
                Run it
              </Button>
            </div>
          ) : (
            <motion.div
              key={style}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={trueCount === 4 ? "success" : "changed"}>
                  {trueCount} OF {results.length} TRUE
                </StateBadge>
                <span className="text-xs text-muted-foreground">evaluated just now</span>
              </div>

              <ol className="space-y-1.5">
                {results.map((comparison) => (
                  <ComparisonRow key={comparison.id} comparison={comparison} />
                ))}
              </ol>

              <p className="text-sm text-muted-foreground">{CONCLUSION[style]}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
