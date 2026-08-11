"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TimerProps {
  durationMs: number;
  remainingMs: number;
  isRunning: boolean;
  label?: string;
  variant?: "bar" | "ring";
  className?: string;
}

export function Timer({
  durationMs,
  remainingMs,
  isRunning,
  label,
  variant = "bar",
  className,
}: TimerProps) {
  const progress = durationMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / durationMs)) : 0;
  const seconds = (remainingMs / 1000).toFixed(1);

  if (variant === "ring") {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        <svg width="48" height="48" viewBox="0 0 48 48" role="img" aria-label={`${label ?? "Timer"}: ${seconds}s remaining`}>
          <circle cx="24" cy="24" r={radius} className="fill-none stroke-muted" strokeWidth="4" />
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            className={cn("fill-none", isRunning ? "stroke-primary" : "stroke-muted-foreground/50")}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.15, ease: "linear" }}
            transform="rotate(-90 24 24)"
          />
          <text x="24" y="28" textAnchor="middle" className="fill-foreground font-mono text-[10px]">
            {seconds}s
          </text>
        </svg>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="font-mono">{seconds}s</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Timer progress"}
      >
        <motion.div
          className={cn("h-full rounded-full", isRunning ? "bg-primary" : "bg-muted-foreground/50")}
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </div>
    </div>
  );
}
