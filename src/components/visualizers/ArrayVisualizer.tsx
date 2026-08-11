"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ArrayItemStatus = "default" | "active" | "match" | "reject" | "removed" | "added";

export interface ArrayItemState {
  id: string;
  label: string;
  status?: ArrayItemStatus;
  sublabel?: string;
}

export interface ArrayVisualizerProps {
  items: ArrayItemState[];
  label?: string;
  emptyHint?: string;
  className?: string;
}

const STATUS_STYLES: Record<ArrayItemStatus, string> = {
  default: "border-border bg-card",
  active: "border-primary bg-primary/10 ring-2 ring-primary/40",
  match: "border-emerald-500/50 bg-emerald-500/10",
  reject: "border-border bg-muted/40 opacity-60",
  removed: "border-destructive/50 bg-destructive/10 opacity-60",
  added: "border-sky-500/50 bg-sky-500/10",
};

export function ArrayVisualizer({ items, label, emptyHint, className }: ArrayVisualizerProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
      <div className="flex min-h-14 flex-wrap items-center gap-2" role="list" aria-label={label}>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              role="listitem"
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex min-w-10 flex-col items-center justify-center rounded-md border px-2.5 py-1.5 font-mono text-sm",
                STATUS_STYLES[item.status ?? "default"]
              )}
            >
              <span className="flex items-center gap-1">
                {item.status === "match" && <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />}
                {item.status === "reject" && <X className="size-3.5 text-muted-foreground" />}
                {item.label}
              </span>
              {item.sublabel && <span className="text-[0.65rem] text-muted-foreground">{item.sublabel}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && emptyHint && (
          <p className="text-xs text-muted-foreground italic">{emptyHint}</p>
        )}
      </div>
    </div>
  );
}
