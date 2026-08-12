"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/learning/InlineCode";
import { InlineCodeText } from "@/components/learning/InlineCodeText";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import { buildCase, SECOND_COUNTER_LABEL, type CallsBefore, type SecondCounter } from "./experimentCode";

const SECONDS: readonly SecondCounter[] = ["same", "new"];
const CALL_COUNTS: readonly CallsBefore[] = ["1", "2", "3"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 */
export function ClosuresExperiment() {
  const [second, setSecond] = useState<SecondCounter>("same");
  const [callsBefore, setCallsBefore] = useState<CallsBefore>("1");
  const [revealed, setRevealed] = useState(false);

  const current = useMemo(() => buildCase(second, callsBefore), [second, callsBefore]);

  // Any control change invalidates the previous answer: the result and its
  // explanation go away together.
  function selectSecond(next: SecondCounter) {
    setSecond(next);
    setRevealed(false);
  }

  function selectCallsBefore(next: CallsBefore) {
    setCallsBefore(next);
    setRevealed(false);
  }

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above — change how the second counter is made, predict the result,
          then check it. The factory never changes.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="How second was made"
          options={SECONDS}
          value={second}
          onChange={selectSecond}
          optionLabel={(option) => SECOND_COUNTER_LABEL[option]}
        />
        <SegmentedControl
          label="Calls to first() before"
          options={CALL_COUNTS}
          value={callsBefore}
          onChange={selectCallsBefore}
          optionLabel={(option) => option}
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
          {!revealed ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">What happens at the highlighted line?</p>
              <p className="text-xs text-muted-foreground">
                Make your prediction, then check it against what JavaScript actually does.
              </p>
              <Button type="button" size="sm" onClick={() => setRevealed(true)} className="w-full @md:w-auto">
                Check result
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${second}-${callsBefore}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={second === "same" ? "changed" : "success"}>{current.badge}</StateBadge>
                <span className="text-xs text-muted-foreground">
                  after {callsBefore} call{callsBefore === "1" ? "" : "s"} to <InlineCode>first()</InlineCode>
                </span>
              </div>

              <p className="font-mono text-xs text-foreground">{current.output}</p>

              <div className="flex flex-wrap items-center gap-2">
                {current.counts.map((entry) => (
                  <VariableBox key={entry.label} name={entry.label} displayValue={entry.value} status="set" size="sm" />
                ))}
              </div>

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
