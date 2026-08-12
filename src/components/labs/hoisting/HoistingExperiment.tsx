"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/learning/InlineCode";
import { InlineCodeText } from "@/components/learning/InlineCodeText";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { SegmentedControl } from "./SegmentedControl";
import { STATE_LABEL, STATE_TONE } from "./BindingRecord";
import { buildCase, DECLARATION_LABEL, MOMENT_LABEL, type Moment } from "./outcome";
import type { DeclarationType } from "./types";

const KINDS: readonly DeclarationType[] = ["var", "let", "const", "function"];
const MOMENTS: readonly Moment[] = ["before", "after"];

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no engine, so
 * changing a control here can never move the player's current step.
 */
export function HoistingExperiment() {
  const [kind, setKind] = useState<DeclarationType>("let");
  const [moment, setMoment] = useState<Moment>("before");
  const [revealed, setRevealed] = useState(false);

  // Code, highlight lines and outcome all come from one call, so the preview
  // can never describe a different case than the revealed result.
  const current = useMemo(() => buildCase(kind, moment), [kind, moment]);

  // Any control change invalidates the previous answer: the result, its
  // explanation and the declaration-line highlight all go away together.
  function selectKind(next: DeclarationType) {
    setKind(next);
    setRevealed(false);
  }

  function selectMoment(next: Moment) {
    setMoment(next);
    setRevealed(false);
  }

  const activeLines = revealed ? [current.useLine, current.declarationLine] : [current.useLine];

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above — change a declaration, predict the result, then check it. The
          value is always <InlineCode>&quot;Ready&quot;</InlineCode>.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[2fr_3fr]">
        <SegmentedControl
          label="Declaration kind"
          options={KINDS}
          value={kind}
          onChange={selectKind}
          optionLabel={(k) => DECLARATION_LABEL[k]}
          mono
        />
        <SegmentedControl
          label="Moment of use"
          options={MOMENTS}
          value={moment}
          onChange={selectMoment}
          optionLabel={(m) => MOMENT_LABEL[m]}
        />
      </div>

      {/* Both columns start directly with their panel, so their tops line up. The
          code panel carries its own "Generated code" title bar instead of an
          external label. */}
      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={current.code} activeLines={activeLines} title="Generated code" />
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
              key={`${kind}-${moment}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone={current.succeeded ? "success" : "error"}>{current.badge}</StateBadge>
                <span className="text-xs text-muted-foreground">{MOMENT_LABEL[moment].toLowerCase()}</span>
              </div>

              <p className={current.succeeded ? "font-mono text-xs text-foreground" : "font-mono text-xs text-destructive"}>
                {current.output}
              </p>

              <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>Binding state:</span>
                <StateBadge tone={STATE_TONE[current.bindingState]}>{STATE_LABEL[current.bindingState]}</StateBadge>
              </p>

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
