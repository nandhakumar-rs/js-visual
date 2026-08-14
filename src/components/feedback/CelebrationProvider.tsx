"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PartyPopper, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { playCue } from "@/lib/sound/play";
import type { CelebrationEvent, CelebrationTier } from "@/lib/progress/celebration";
import { Popper } from "./Popper";

interface CelebrationContextValue {
  celebrate: (event: CelebrationEvent) => void;
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

const TIER_META: Record<CelebrationTier, { icon: typeof Sparkles; ring: string; ms: number }> = {
  lesson: { icon: Sparkles, ring: "border-primary/50 bg-card", ms: 2200 },
  section: { icon: PartyPopper, ring: "border-emerald-500/60 bg-card", ms: 3200 },
  track: { icon: Trophy, ring: "border-amber-500/60 bg-card", ms: 4500 },
};

interface Active extends CelebrationEvent {
  seed: number;
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Active | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A counter rather than Date.now(): two celebrations fired in the same
  // millisecond must still get distinct seeds, or the second would not remount.
  const nextSeed = useRef(0);

  const celebrate = useCallback((event: CelebrationEvent) => {
    playCue(event.tier);
    nextSeed.current += 1;
    setActive({ ...event, seed: nextSeed.current });
  }, []);

  useEffect(() => {
    if (!active) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(null), TIER_META[active.tier].ms);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active]);

  const Icon = active ? TIER_META[active.tier].icon : Sparkles;

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}

      {/* Keyed on the seed so a repeat celebration remounts and replays from
          the start, rather than motion tweening from the previous burst. */}
      {active && <Popper key={active.seed} tier={active.tier} seed={active.seed} />}

      <AnimatePresence>
        {active && (
          <motion.div
            key={active.key + active.seed}
            // Drops in from above, since it now enters from the top edge.
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            role="status"
            aria-live="polite"
            // top-20 rather than top-0: the app header is sticky at h-14, and
            // this sits above it at z-50, so anything higher would cover the
            // search field and the progress ring.
            className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4"
          >
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-full border px-4 py-2 shadow-lg",
                TIER_META[active.tier].ring
              )}
            >
              <Icon
                aria-hidden
                className={cn(
                  "size-4",
                  active.tier === "lesson" && "text-primary",
                  active.tier === "section" && "text-emerald-500",
                  active.tier === "track" && "text-amber-500"
                )}
              />
              <span className="text-sm font-medium">{active.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CelebrationContext.Provider>
  );
}

/**
 * Returns a no-op outside the provider rather than throwing, so a component
 * rendered in isolation (or in a test) never breaks over decoration.
 */
export function useCelebrate(): (event: CelebrationEvent) => void {
  const ctx = useContext(CelebrationContext);
  return ctx?.celebrate ?? (() => {});
}
