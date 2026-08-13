"use client";

import { Check, CornerDownRight, Minus, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CallStack } from "@/components/visualizers/CallStack";
import { PhaseStrip } from "@/components/visualizers/PhaseStrip";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type {
  DeepComparisonInputs,
  DeepComparisonStepState,
  NodeStatus,
  TreeNode,
  WalkPhase,
} from "./types";

// The same three moves happen at every level of the tree, so the strip cycles
// rather than advancing — the same choice the Callback Hell and async lessons
// made, for the same reason: the repetition is the teaching.
const MOVE = [
  { id: "compare", label: "Compare one pair of values" },
  { id: "descend", label: "Both objects — ask again, one level down" },
  { id: "answer", label: "Come back with an answer" },
];

const STAGE_FOR_PHASE: Record<WalkPhase, string> = {
  comparing: "compare",
  descending: "descend",
  returning: "answer",
  "short-circuit": "answer",
  done: "answer",
};

const STATUS_META: Record<
  NodeStatus,
  { tone: StateBadgeTone | null; row: string; icon: typeof Check | null }
> = {
  pending: { tone: null, row: "border-border/60 bg-card/20", icon: null },
  visiting: { tone: "new", row: "border-primary bg-primary/5", icon: null },
  match: { tone: "success", row: "border-emerald-500/40 bg-emerald-500/5", icon: Check },
  mismatch: { tone: "error", row: "border-destructive/40 bg-destructive/5", icon: X },
  skipped: { tone: "neutral", row: "border-dashed border-border/60 bg-card/10", icon: Minus },
};

const STATUS_LABEL: Record<NodeStatus, string> = {
  pending: "",
  visiting: "COMPARING",
  match: "MATCH",
  mismatch: "DIFFERENT",
  skipped: "NEVER VISITED",
};

/**
 * The two objects drawn as one merged tree: one row per pair of values at the
 * same path, indented by depth.
 *
 * Local to this lesson rather than shared — DOMTree is DOM-specific (tags and
 * attributes) and nothing else here needs a value tree. Same rule the async
 * lessons followed with LoopGate, DrainGate and SuspendedFrame.
 */
function ValueTree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ol className="space-y-1" aria-label="Value tree">
      {nodes.map((node) => {
        const meta = STATUS_META[node.status];
        const Icon = meta.icon;
        return (
          <motion.li
            key={node.id}
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: node.depth * 16 }}
            className={cn("space-y-1 rounded-md border px-2.5 py-1.5", meta.row)}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {node.depth > 0 && (
                <CornerDownRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 break-all font-mono text-[0.7rem] text-muted-foreground">
                {node.path}
              </span>
              {meta.tone && (
                <StateBadge tone={meta.tone} className="ml-auto">
                  {Icon && <Icon aria-hidden className="mr-0.5 inline size-3" />}
                  {STATUS_LABEL[node.status]}
                </StateBadge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="min-w-0 break-all">{node.left}</span>
              <span
                className={cn(
                  "shrink-0 text-muted-foreground",
                  node.status === "match" && "text-emerald-600 dark:text-emerald-400",
                  node.status === "mismatch" && "text-destructive"
                )}
              >
                {node.status === "mismatch" ? "!==" : "==="}
              </span>
              <span className="min-w-0 break-all">{node.right}</span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export function DeepComparisonVisualization({
  step,
}: LabVisualizationProps<DeepComparisonInputs, DeepComparisonStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  const { phase, nodes, callStack, comparisons, result, note } = state;

  return (
    <div className="space-y-3">
      <PhaseStrip stages={MOVE} currentId={STAGE_FOR_PHASE[phase]} ariaLabel="Recursion step" />

      {nodes.length > 0 && <ValueTree nodes={nodes} />}

      <CallStack frames={callStack} />

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2">
        <span className="text-xs text-muted-foreground">Calls to deepEqual</span>
        <StateBadge tone={comparisons > 0 ? "changed" : "neutral"}>{comparisons}</StateBadge>
        {result !== undefined && (
          <>
            <span className="ml-auto text-xs text-muted-foreground">Result</span>
            <StateBadge tone={result ? "success" : "error"}>{String(result)}</StateBadge>
          </>
        )}
      </div>

      {note && (
        <p className="rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
