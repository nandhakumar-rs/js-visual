"use client";

import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface EventBubbleProps {
  path: string[];
  activeIndex: number;
  className?: string;
}

export function EventBubble({ path, activeIndex, className }: EventBubbleProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)} role="list" aria-label="Event bubbling path">
      {[...path].reverse().map((label, reversedIndex) => {
        const index = path.length - 1 - reversedIndex;
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;
        return (
          <div key={label} role="listitem" className="flex flex-col items-center gap-1">
            <motion.div
              layout
              animate={{ scale: isActive ? 1.08 : 1 }}
              className={cn(
                "rounded-md border px-3 py-1.5 font-mono text-sm",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : isPast
                    ? "border-emerald-500/40 bg-emerald-500/5 text-muted-foreground"
                    : "border-border bg-card text-muted-foreground"
              )}
            >
              {label}
            </motion.div>
            {reversedIndex < path.length - 1 && <ArrowUp className="size-3.5 text-muted-foreground" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}
