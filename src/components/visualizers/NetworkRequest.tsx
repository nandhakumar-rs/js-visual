"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type NetworkStatus = "pending" | "success" | "error";

export interface NetworkRequestProps {
  label: string;
  durationMs: number;
  elapsedMs: number;
  status: NetworkStatus;
  className?: string;
}

const STATUS_BAR: Record<NetworkStatus, string> = {
  pending: "bg-primary",
  success: "bg-emerald-500",
  error: "bg-destructive",
};

export function NetworkRequest({ label, durationMs, elapsedMs, status, className }: NetworkRequestProps) {
  const pct = durationMs > 0 ? Math.min(100, Math.round((elapsedMs / durationMs) * 100)) : 100;
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono">{label}</span>
        <span className="text-muted-foreground">
          {status === "pending" ? `${elapsedMs}ms / ${durationMs}ms` : status === "success" ? "done" : "failed"}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", STATUS_BAR[status])}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  );
}
