"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type {
  Binding,
  Comparison,
  EqualityPhase,
  HeapObject,
  ShallowComparisonInputs,
  ShallowComparisonStepState,
} from "./types";

// A check that runs once to a verdict, so this strip advances rather than
// cycling — unlike the async lessons, where the repetition was the teaching.
const CHECK = [
  { id: "point", label: "What each name points to" },
  { id: "check", label: "What the comparison checks" },
  { id: "result", label: "The result" },
];

const STAGE_FOR_PHASE: Record<EqualityPhase, string> = {
  bindings: "point",
  comparing: "check",
  "nested-check": "check",
  verdict: "result",
  done: "result",
};

/**
 * One object as it exists in memory, tagged with its identity.
 *
 * The tag is what makes this lesson visible at all: two look-alike objects are
 * indistinguishable on screen without it, which is precisely the learner's
 * misconception. The names that lead here are listed on the left with an arrow,
 * reusing the visual language the Values & References lesson established
 * (see ImmutableArraysVisualization) so an arriving learner recognises the shape.
 */
function IdentityBox({ object, names }: { object: HeapObject; names: string[] }) {
  return (
    <motion.div layout className="flex min-w-0 items-center gap-2">
      <div className="flex shrink-0 flex-col gap-1">
        {names.length > 0 ? (
          names.map((name) => (
            <div
              key={name}
              className="flex h-7 min-w-[4.5rem] items-center justify-center rounded-md border border-border bg-card px-2 font-mono text-xs text-muted-foreground"
            >
              {name}
            </div>
          ))
        ) : (
          <div className="flex h-7 min-w-[4.5rem] items-center justify-center rounded-md border border-dashed border-border/60 px-2 font-mono text-[0.65rem] text-muted-foreground">
            unnamed
          </div>
        )}
      </div>

      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />

      <div className="min-w-0 flex-1 space-y-1">
        <StateBadge tone={object.isActive ? "new" : "neutral"}>OBJECT {object.tag}</StateBadge>
        <ObjectVisualizer entries={object.entries} isActive={object.isActive} />
      </div>
    </motion.div>
  );
}

/**
 * One evaluated comparison. Kept local rather than generalised: this is the
 * only lesson whose subject is the verdict itself, following the same rule as
 * the async lessons' LoopGate, DrainGate and SuspendedFrame.
 */
export function ComparisonRow({ comparison }: { comparison: Comparison }) {
  const { label, result, note } = comparison;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "space-y-0.5 rounded-md border px-3 py-2",
        result ? "border-emerald-500/40 bg-emerald-500/5" : "border-destructive/40 bg-destructive/5"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="min-w-0 break-all font-mono text-xs">{label}</span>
        <StateBadge tone={result ? "success" : "error"}>
          {result ? (
            <Check aria-hidden className="mr-0.5 inline size-3" />
          ) : (
            <X aria-hidden className="mr-0.5 inline size-3" />
          )}
          {String(result)}
        </StateBadge>
      </div>
      {note && <p className="text-[0.7rem] text-muted-foreground">{note}</p>}
    </motion.li>
  );
}

function namesFor(bindings: Binding[], objectId: string): string[] {
  return bindings.filter((b) => b.target === objectId).map((b) => b.name);
}

export function ShallowComparisonVisualization({
  step,
}: LabVisualizationProps<ShallowComparisonInputs, ShallowComparisonStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, objects, bindings, comparisons, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={CHECK} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Comparison stage" />

      <div className="space-y-2">
        {objects.map((object) => (
          <IdentityBox key={object.id} object={object} names={namesFor(bindings, object.id)} />
        ))}
      </div>

      {comparisons.length > 0 && (
        <ol className="space-y-1.5">
          {comparisons.map((comparison) => (
            <ComparisonRow key={comparison.id} comparison={comparison} />
          ))}
        </ol>
      )}

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
