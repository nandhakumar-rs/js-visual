"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { cn } from "@/lib/utils";

export interface OperationFlowProps {
  /** What's being operated on, e.g. "a". */
  label: string;
  /** The value going into the operator, e.g. "undefined". */
  input: string;
  /** The operator applied, e.g. "typeof". */
  operator: string;
  /** The resulting value, e.g. '"undefined"'. */
  output: string;
  /** Optional inline glossary callout attached to the result (e.g. a quirk explanation). */
  note?: { term: string; tooltip: ReactNode };
  className?: string;
}

/**
 * A single animated "input → operator → result" row — shows exactly how a
 * value flows through an operator to produce an output. Concept-specific and
 * deliberately minimal (no call stack / queues); reusable by any future
 * lesson that applies an operator to a value (typeof, instanceof, etc.).
 */
export function OperationFlow({ label, input, operator, output, note, className }: OperationFlowProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${label}-${input}-${operator}-${output}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm",
          className
        )}
      >
        <span className="text-muted-foreground">{label}</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <span>{input}</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">{operator}</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="font-semibold">{output}</span>
        {note && (
          <InfoTooltip label={note.term} className="text-xs font-normal">
            {note.tooltip}
          </InfoTooltip>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
