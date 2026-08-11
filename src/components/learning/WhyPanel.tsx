"use client";

import { Brain } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface WhyPanelProps {
  text?: string;
  className?: string;
}

export function WhyPanel({ text, className }: WhyPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 p-4",
        className
      )}
    >
      <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
        <Brain className="size-4 text-primary" aria-hidden />
        Why did this happen?
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          {text ?? "Run the code or step through it to see an explanation here."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
