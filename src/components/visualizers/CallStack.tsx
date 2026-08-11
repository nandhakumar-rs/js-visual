"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CallStackFrame {
  id: string;
  label: string;
  isActive?: boolean;
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
              {frame.label}
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
