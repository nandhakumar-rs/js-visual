"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { buildCase, POSITION_LABEL, runCase, type Handlers, type TimerPosition } from "./experimentCode";

const HANDLER_COUNTS: readonly Handlers[] = ["1", "2", "3"];
const POSITIONS: readonly TimerPosition[] = ["before", "after"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 *
 * The order shown is observed by running the generated program, not predicted.
 */
export function MicrotaskExperiment() {
  const [handlers, setHandlers] = useState<Handlers>("2");
  const [position, setPosition] = useState<TimerPosition>("before");
  const [order, setOrder] = useState<string[] | null>(null);
  const [running, setRunning] = useState(false);

  const current = useMemo(() => buildCase(handlers, position), [handlers, position]);

  // Any control change invalidates the previous run.
  function selectHandlers(next: Handlers) {
    setHandlers(next);
    setOrder(null);
  }

  function selectPosition(next: TimerPosition) {
    setPosition(next);
    setOrder(null);
  }

  async function handleRun() {
    setRunning(true);
    const observed = await runCase(current.handlers, current.position);
    setOrder(observed);
    setRunning(false);
  }

  const timerIndex = order ? order.indexOf("setTimeout") + 1 : 0;

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above. Move the timer above or below the chain, then run it — the
          order you get back is the real one, logged by your browser.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[2fr_3fr]">
        <SegmentedControl
          label="Handlers in the chain"
          options={HANDLER_COUNTS}
          value={handlers}
          onChange={selectHandlers}
          optionLabel={(option) => option}
          mono
        />
        <SegmentedControl
          label="Where setTimeout is written"
          options={POSITIONS}
          value={position}
          onChange={selectPosition}
          optionLabel={(option) => POSITION_LABEL[option]}
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
          {!order ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">In what order will these log?</p>
              <p className="text-xs text-muted-foreground">
                Predict it, then run the program and compare.
              </p>
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
              key={`${handlers}-${position}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone="changed">
                  TIMER RAN {timerIndex} OF {order.length}
                </StateBadge>
                <span className="text-xs text-muted-foreground">observed just now</span>
              </div>

              <ol className="space-y-1">
                {order.map((label, i) => (
                  <li
                    key={`${label}-${i}`}
                    className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1"
                  >
                    <span className="font-mono text-[0.65rem] text-muted-foreground">{i + 1}</span>
                    <span className="font-mono text-xs">{label}</span>
                    {label === "setTimeout" && (
                      <span className="ml-auto text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                        task queue
                      </span>
                    )}
                    {label.startsWith(".then") && (
                      <span className="ml-auto text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                        microtask queue
                      </span>
                    )}
                  </li>
                ))}
              </ol>

              <p className="text-sm text-muted-foreground">
                The timer is last either way. Writing it above the chain or below it changes nothing, because
                position in the source is not what decides the order — the queue it went into is.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
