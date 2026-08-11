"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ObjectEntry {
  key: string;
  displayValue: string;
  isReference?: boolean;
}

export interface ObjectVisualizerProps {
  label?: string;
  entries: ObjectEntry[];
  isActive?: boolean;
  className?: string;
}

export function ObjectVisualizer({ label, entries, isActive, className }: ObjectVisualizerProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border bg-card/50 p-3 font-mono text-sm",
        isActive ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border",
        className
      )}
    >
      {label && <p className="mb-1.5 font-sans text-xs font-semibold text-muted-foreground">{label}</p>}
      <dl className="space-y-0.5">
        {entries.map((entry) => (
          <div key={entry.key} className="flex gap-2">
            <dt className="text-muted-foreground">{entry.key}:</dt>
            <dd className={cn(entry.isReference && "text-sky-600 dark:text-sky-400")}>{entry.displayValue}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
