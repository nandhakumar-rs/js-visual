"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AlertTriangle, ChevronRight, Trash2, XCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ConsoleEntry } from "@/lib/execution/types";

export interface ConsolePanelProps {
  entries: ConsoleEntry[];
  onClear?: () => void;
  className?: string;
}

const KIND_STYLES: Record<ConsoleEntry["kind"], string> = {
  command: "text-foreground font-mono",
  output: "text-muted-foreground font-mono",
  warning: "text-amber-600 dark:text-amber-400 font-mono",
  error: "text-destructive font-mono",
  async: "text-sky-600 dark:text-sky-400 font-mono",
};

const KIND_ICON: Record<ConsoleEntry["kind"], ReactNode> = {
  command: <ChevronRight className="size-3.5 shrink-0" />,
  output: <span className="w-3.5 shrink-0" />,
  warning: <AlertTriangle className="size-3.5 shrink-0" />,
  error: <XCircle className="size-3.5 shrink-0" />,
  async: <Zap className="size-3.5 shrink-0" />,
};

export function ConsolePanel({ entries, onClear, className }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEmpty = entries.length === 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries.length]);

  if (isEmpty) {
    return (
      <div className={cn("rounded-lg border border-border bg-card", className)}>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Console</span>
          <span className="text-xs text-muted-foreground italic">Output will appear here.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Console</span>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs"
            onClick={onClear}
            aria-label="Clear console"
          >
            <Trash2 className="size-3.5" />
            Clear
          </Button>
        )}
      </div>
      <div ref={scrollRef} className="max-h-48 overflow-y-auto p-3 text-sm">
        <ul className="space-y-1" aria-live="polite" aria-atomic="false">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex items-start gap-1.5", KIND_STYLES[entry.kind])}
              >
                {KIND_ICON[entry.kind]}
                <span className="whitespace-pre-wrap break-words">{entry.content}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
