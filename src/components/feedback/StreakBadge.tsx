"use client";

import { Flame } from "lucide-react";
import { motion } from "motion/react";
import { useProgress } from "@/lib/progress/store";

/**
 * The current run of questions answered correctly on the first attempt.
 *
 * Hidden below 2 — "1 in a row" is not a streak, and showing it on every
 * question would make the badge ambient rather than an event.
 */
export function StreakBadge() {
  const streak = useProgress((s) => s.firstTryStreak);

  if (streak < 2) return null;

  return (
    <motion.span
      key={streak}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
      title="Questions answered correctly on the first try, in a row"
    >
      <Flame aria-hidden className="size-3" />
      {streak} in a row
    </motion.span>
  );
}
