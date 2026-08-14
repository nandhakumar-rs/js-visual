"use client";

import { getMvpConcepts } from "@/data/concepts";
import { useProgress } from "@/lib/progress/store";

const RADIUS = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Whole-track orientation in the header: how many of the visible lessons are
 * finished. Renders 0 / N on the server and for the first client frame, since
 * the progress store is rehydrated post-mount — the same behaviour SectionCard
 * already has, so it stays consistent rather than introducing a new pattern.
 */
export function TrackProgress() {
  const total = getMvpConcepts().length;
  const completedLessons = useProgress((s) => s.completedLessons);
  const completed = completedLessons.length;
  const fraction = total > 0 ? Math.min(1, completed / total) : 0;

  return (
    <div
      className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 sm:flex"
      title={`${completed} of ${total} lessons complete`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="-rotate-90">
        <circle cx="9" cy="9" r={RADIUS} className="fill-none stroke-muted" strokeWidth="2.5" />
        <circle
          cx="9"
          cy="9"
          r={RADIUS}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-500"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        <span className="sr-only">Lessons complete: </span>
        {completed}/{total}
      </span>
    </div>
  );
}
