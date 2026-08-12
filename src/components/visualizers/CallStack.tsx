"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StateBadge, type StateBadgeTone } from "./StateBadge";
import { VariableBox } from "./VariableBox";
import type { VariableEntry } from "./ScopeBox";

export interface CallStackFrame {
  id: string;
  label: string;
  isActive?: boolean;
  /** Small status pill under the label, e.g. { text: "CURRENTLY RUNNING", tone: "new" } or { text: "PAUSED — WAITING FOR multiply()", tone: "changed" }. */
  statusBadge?: { text: string; tone: StateBadgeTone };
  /** Params/locals shown inside the frame, reusing VariableBox's visual language. */
  variables?: VariableEntry[];
  /** This step's value being passed back into this frame, shown as a small travelling-value callout. */
  returnValue?: string;
}

export interface CallStackProps {
  frames: CallStackFrame[];
  className?: string;
  title?: string;
}

export function CallStack({ frames, className, title = "Call Stack" }: CallStackProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card/50 p-3", className)}>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex min-h-24 flex-col-reverse gap-1.5" role="list" aria-label={title}>
        <AnimatePresence initial={false}>
          {frames.map((frame) => (
            <motion.div
              key={frame.id}
              role="listitem"
              layout
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "rounded-md border px-3 py-1.5 font-mono text-xs",
                frame.isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-muted-foreground"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span>{frame.label}</span>
                {frame.statusBadge && (
                  <StateBadge tone={frame.statusBadge.tone}>{frame.statusBadge.text}</StateBadge>
                )}
              </div>
              {frame.variables && frame.variables.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {frame.variables.map((v) => (
                    <VariableBox
                      key={v.name}
                      name={v.name}
                      value={v.value}
                      displayValue={v.displayValue}
                      status={v.status}
                      previousValue={v.previousValue}
                      size="sm"
                    />
                  ))}
                </div>
              )}
              {frame.returnValue && (
                <p className="mt-1.5 text-[0.65rem] font-semibold text-sky-600 dark:text-sky-400">
                  returns {frame.returnValue} &rarr;
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {frames.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground italic">Empty</p>
        )}
      </div>
    </div>
  );
}
