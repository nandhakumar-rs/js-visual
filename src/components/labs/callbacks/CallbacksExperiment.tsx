"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { InlineCodeText } from "@/components/learning/InlineCodeText";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import {
  buildCase,
  DELIVERY_LABEL,
  TIMING_LABEL,
  type Delivery,
  type Timing,
} from "./experimentCode";

const TIMINGS: readonly Timing[] = ["now", "later"];
const DELIVERIES: readonly Delivery[] = ["return", "callback"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * The two controls are the lesson's question split in half — only when the
 * work finishes later does returning the result stop working.
 */
export function CallbacksExperiment() {
  const [timing, setTiming] = useState<Timing>("now");
  const [delivery, setDelivery] = useState<Delivery>("return");
  const [revealed, setRevealed] = useState(false);

  const current = useMemo(() => buildCase(timing, delivery), [timing, delivery]);

  // Any control change invalidates the previous answer: the result and its
  // explanation go away together.
  function selectTiming(next: Timing) {
    setTiming(next);
    setRevealed(false);
  }

  function selectDelivery(next: Delivery) {
    setDelivery(next);
    setRevealed(false);
  }

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above — change when the work finishes and how the answer comes
          back, predict the result, then check it. Only one of the four combinations is broken.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="When the work finishes"
          options={TIMINGS}
          value={timing}
          onChange={selectTiming}
          optionLabel={(option) => TIMING_LABEL[option]}
        />
        <SegmentedControl
          label="How the answer comes back"
          options={DELIVERIES}
          value={delivery}
          onChange={selectDelivery}
          optionLabel={(option) => DELIVERY_LABEL[option]}
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
              <p className="text-sm font-medium">What does the highlighted line log?</p>
              <p className="text-xs text-muted-foreground">
                Make your prediction, then check it against what JavaScript actually does.
              </p>
              <Button type="button" size="sm" onClick={() => setRevealed(true)} className="w-full @md:w-auto">
                Check result
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${timing}-${delivery}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={current.tone}>{current.badge}</StateBadge>
                <span className="text-xs text-muted-foreground">logs {current.whenNote}</span>
              </div>

              <p className="font-mono text-xs text-foreground">{current.output}</p>

              <div className="flex flex-wrap items-center gap-2">
                {current.boxes.map((box) => (
                  <VariableBox
                    key={box.label}
                    name={box.label}
                    displayValue={box.value}
                    status={box.status}
                    size="sm"
                  />
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
