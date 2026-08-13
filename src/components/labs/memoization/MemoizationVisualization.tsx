"use client";

import { AlertTriangle, ArrowRight, Check, Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type {
  CacheRow,
  CallPhase,
  EntryStatus,
  MemoizationInputs,
  MemoizationStepState,
} from "./types";

// Every call repeats the same three moves, so the strip cycles rather than
// advancing — the same choice the async and recursion lessons made.
const CALL = [
  { id: "call", label: "A call arrives" },
  { id: "look", label: "Look in the cache" },
  { id: "answer", label: "Hit: return it. Miss: compute and store." },
];

const STAGE_FOR_PHASE: Record<CallPhase, string> = {
  calling: "call",
  looking: "look",
  hit: "answer",
  miss: "answer",
  "bad-hit": "answer",
  done: "answer",
};

const STATUS_META: Record<
  EntryStatus,
  { row: string; badge: { text: string; tone: StateBadgeTone; icon: typeof Check } | null }
> = {
  stored: { row: "border-border/60 bg-card/20", badge: null },
  added: {
    row: "border-sky-500/40 bg-sky-500/5",
    badge: { text: "STORED", tone: "new", icon: Plus },
  },
  hit: {
    row: "border-emerald-500/40 bg-emerald-500/5",
    badge: { text: "HIT", tone: "success", icon: Check },
  },
  bad: {
    row: "border-destructive/50 bg-destructive/5",
    badge: { text: "SHOULD NOT MATCH", tone: "error", icon: AlertTriangle },
  },
};

/**
 * The cache, drawn as what it is: keys mapped to values.
 *
 * The key column renders the key *exactly* as the cache holds it — `2` for a
 * number, `#1` for an object identity, the literal `[{}]` string for a
 * stringified argument list. That is the whole point of the card: both of this
 * lesson's failures are only visible once you can see the real key. Local to
 * the lesson, following LoopGate / DrainGate / SuspendedFrame / IdentityBox.
 */
function CacheTable({
  entries,
  label,
  hidden,
}: {
  entries: CacheRow[];
  label?: string;
  hidden?: number;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-card/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold">{label ? `${label} — cache` : "Cache"}</p>
        <StateBadge tone="neutral">
          {entries.length + (hidden ?? 0)} {entries.length + (hidden ?? 0) === 1 ? "entry" : "entries"}
        </StateBadge>
      </div>

      {entries.length === 0 ? (
        <p className="py-2 text-center text-xs italic text-muted-foreground">Empty</p>
      ) : (
        <ol className="space-y-1" aria-label="Cache entries">
          {entries.map((entry) => {
            const meta = STATUS_META[entry.status];
            const Icon = meta.badge?.icon;
            return (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border px-2.5 py-1.5",
                  meta.row
                )}
              >
                <span className="min-w-0 break-all font-mono text-xs">{entry.key}</span>
                <ArrowRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
                <span className="min-w-0 break-all font-mono text-xs text-muted-foreground">
                  {entry.value}
                </span>
                {meta.badge && (
                  <StateBadge tone={meta.badge.tone} className="ml-auto shrink-0">
                    {Icon && <Icon aria-hidden className="mr-0.5 inline size-3" />}
                    {meta.badge.text}
                  </StateBadge>
                )}
              </motion.li>
            );
          })}
        </ol>
      )}

      {hidden !== undefined && hidden > 0 && (
        <p className="text-center text-[0.7rem] italic text-muted-foreground">
          … and {hidden} more, all kept
        </p>
      )}
    </div>
  );
}

export function MemoizationVisualization({
  step,
}: LabVisualizationProps<MemoizationInputs, MemoizationStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, entries, calls, calculations, hits, cacheLabel, hiddenEntries, note } = state;
  const saved = calls > 0 ? Math.round((hits / calls) * 100) : 0;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={CALL} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Call stage" />

      <CacheTable entries={entries} label={cacheLabel} hidden={hiddenEntries} />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Calls", value: calls, tone: "neutral" as StateBadgeTone },
          { label: "Calculations", value: calculations, tone: "changed" as StateBadgeTone },
          { label: "Cache hits", value: hits, tone: "success" as StateBadgeTone },
        ].map((counter) => (
          <div
            key={counter.label}
            className="space-y-1 rounded-md border border-border bg-card/40 p-2 text-center"
          >
            <p className="font-mono text-lg font-semibold tabular-nums">{counter.value}</p>
            <StateBadge tone={counter.tone}>{counter.label}</StateBadge>
          </div>
        ))}
      </div>

      {calls > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {saved}% of calls avoided the work
        </p>
      )}

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
