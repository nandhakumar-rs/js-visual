"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface QueueItem {
  id: string;
  label: string;
}

export interface TaskQueueProps {
  title: string;
  items: QueueItem[];
  variant?: "micro" | "macro";
  className?: string;
}

export function TaskQueue({ title, items, variant = "macro", className }: TaskQueueProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card/50 p-3", className)}>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5" role="list" aria-label={title}>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              role="listitem"
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={cn(
                "rounded-md border px-2.5 py-1 font-mono text-xs",
                variant === "micro"
                  ? "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                  : "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400"
              )}
            >
              {item.label}
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <p className="text-xs text-muted-foreground italic">Empty</p>}
      </div>
    </div>
  );
}
