"use client";

import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PromiseState = "pending" | "fulfilled" | "rejected";

export interface PromiseNodeProps {
  label?: string;
  state: PromiseState;
  value?: string;
  className?: string;
}

const STATE_META: Record<PromiseState, { icon: typeof Clock; classes: string }> = {
  pending: { icon: Clock, classes: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  fulfilled: { icon: Check, classes: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  rejected: { icon: X, classes: "border-destructive/50 bg-destructive/10 text-destructive" },
};

export function PromiseNode({ label = "Promise", state, value, className }: PromiseNodeProps) {
  const { icon: Icon, classes } = STATE_META[state];
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm", classes, className)}>
      <Icon className="size-3.5" aria-hidden />
      <span className="font-mono">
        {label}: {state}
        {value !== undefined ? ` (${value})` : ""}
      </span>
    </div>
  );
}
