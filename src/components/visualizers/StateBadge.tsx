import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StateBadgeTone = "neutral" | "changed" | "new" | "success" | "error";

export interface StateBadgeProps {
  children: ReactNode;
  tone?: StateBadgeTone;
  className?: string;
}

const TONE_STYLES: Record<StateBadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  changed: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  new: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  error: "bg-destructive/15 text-destructive",
};

/** Small pill for labeling an array/value's state (e.g. "UNCHANGED", "NEW", "SAME ARRAY CHANGED") — reusable across array-comparison lessons. */
export function StateBadge({ children, tone = "neutral", className }: StateBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
        TONE_STYLES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
