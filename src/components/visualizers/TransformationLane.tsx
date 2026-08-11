"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TransformationLaneProps {
  /**
   * Stable identity for the enter/exit animation. Pass a value that changes
   * only when the visualized transformation actually changes (e.g. the
   * active item's id) — input/expression/output are typically
   * freshly-created elements every render, so they can't safely be used to
   * derive a key the way a plain-string component could.
   */
  stepKey: string;
  /** What's being transformed — can be rich content (e.g. an ObjectVisualizer card). */
  input: ReactNode;
  /** The rule/expression being applied, e.g. "user.name". Rendered as its own code-styled badge — don't additionally wrap it in InlineCode. */
  expression: ReactNode;
  /** The resulting value, e.g. a small result chip. */
  output: ReactNode;
  className?: string;
}

/**
 * A single animated "input → expression → output" row for array-
 * transformation lessons — a sibling to OperationFlow (not a generalization
 * of it), with ReactNode-typed slots so `input` can hold a rendered
 * object/array card instead of a plain string. Reusable by future array
 * lessons (concatenating arrays, removing duplicates, immutable updates)
 * that need to show a rich value flowing through a transformation.
 */
export function TransformationLane({ stepKey, input, expression, output, className }: TransformationLaneProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3",
          className
        )}
      >
        <div>{input}</div>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="rounded bg-primary/10 px-2 py-1 font-mono text-sm text-primary">{expression}</div>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <div>{output}</div>
      </motion.div>
    </AnimatePresence>
  );
}
