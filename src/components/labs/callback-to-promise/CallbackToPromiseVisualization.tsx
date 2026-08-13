"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { PromiseNode } from "@/components/visualizers/PromiseNode";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type { ChainLink, LinkStatus, PromisePhase, PromisesInputs, PromisesStepState } from "./types";

// A chain is one unit repeated, so the strip cycles rather than advancing —
// the same choice the Callback Hell lesson made, for the same reason. The
// difference the learner should notice is that repeating this unit costs
// nothing: no level of indentation, no extra error handling.
const LINK_LIFECYCLE = [
  { id: "pending", label: "A promise is returned, still pending" },
  { id: "settles", label: "It settles — fulfilled or rejected" },
  { id: "handler", label: "The handler runs with that value" },
];

const STAGE_FOR_PHASE: Record<PromisePhase, string> = {
  pending: "pending",
  settling: "settles",
  "handler-runs": "handler",
  done: "handler",
  // A rejection is a settlement — the unwelcome one.
  rejected: "settles",
};

const STATUS_BADGE: Record<LinkStatus, { text: string; tone: StateBadgeTone } | null> = {
  waiting: null,
  pending: null,
  fulfilled: null,
  rejected: null,
  skipped: { text: "SKIPPED", tone: "neutral" },
  caught: { text: "CAUGHT IT", tone: "success" },
};

/**
 * One link in the chain.
 *
 * Rendered as a flat list item, never nested — that flatness against the
 * previous lesson's box-in-box is the whole visual argument. Reuses the
 * existing PromiseNode for the promise this link produced, which is exactly
 * the one thing that component renders well.
 */
function ChainLinkCard({ link }: { link: ChainLink }) {
  const badge = STATUS_BADGE[link.status];
  const isDim = link.status === "waiting" || link.status === "skipped";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "min-w-0 space-y-2 rounded-lg border p-3",
        link.status === "pending" && "border-primary bg-card/50 shadow-[0_0_0_1px_var(--primary)]",
        link.status === "rejected" && "border-destructive/60 bg-destructive/5",
        link.status === "caught" && "border-emerald-500/50 bg-emerald-500/5",
        link.status === "fulfilled" && "border-border bg-card/50",
        isDim && "border-dashed border-border/60 bg-card/20"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "min-w-0 break-all font-mono text-xs font-semibold",
            isDim && "text-muted-foreground line-through decoration-1"
          )}
        >
          {link.label}
        </span>
        {badge && <StateBadge tone={badge.tone}>{badge.text}</StateBadge>}
      </div>

      {link.promiseState && (
        <PromiseNode
          label={link.isCatch ? "caught" : "returns"}
          state={link.promiseState}
          value={link.value}
        />
      )}

      {link.isCatch && link.status === "caught" && link.value && (
        <p className="font-mono text-[0.7rem] text-destructive">{link.value}</p>
      )}
    </motion.li>
  );
}

export function CallbackToPromiseVisualization({
  step,
}: LabVisualizationProps<PromisesInputs, PromisesStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, links, rejectionInFlight, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={LINK_LIFECYCLE} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Promise lifecycle" />

      {rejectionInFlight && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          A rejection is travelling down the chain, looking for a <span className="font-mono">.catch</span>.
        </p>
      )}

      <ol className="space-y-2">
        {links.map((link) => (
          <ChainLinkCard key={link.id} link={link} />
        ))}
      </ol>

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
