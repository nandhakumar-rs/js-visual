"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { CelebrationTier } from "@/lib/progress/celebration";

interface TierConfig {
  count: number;
  /** How high the jet throws, in px. Also scales the horizontal spread. */
  spread: number;
  duration: number;
  size: [number, number];
}

// Counts stay even: each is split between two barrels, so an odd number would
// load one side heavier than the other. Kept deliberately low — the reach below
// is what makes the burst feel big, not the number of pieces.
const TIERS: Record<CelebrationTier, TierConfig> = {
  lesson: { count: 14, spread: 380, duration: 1.5, size: [5, 10] },
  section: { count: 40, spread: 640, duration: 1.9, size: [6, 13] },
  track: { count: 80, spread: 900, duration: 2.5, size: [7, 15] },
};

/**
 * How far particles fall after reaching their peak, as a multiple of `spread`.
 * Above 1 so everything arcs back down past the launch point and leaves the
 * viewport, rather than settling mid-air.
 */
const GRAVITY = 1.45;

// Theme tokens rather than raw hex, so the burst reads in both light and dark.
const COLORS = [
  "var(--primary)",
  "oklch(0.72 0.19 145)",
  "oklch(0.78 0.16 85)",
  "oklch(0.70 0.18 25)",
  "oklch(0.72 0.15 260)",
];

/**
 * A deterministic pseudo-random generator, seeded per burst. Particles need to
 * scatter, but re-rendering must not reshuffle them mid-flight.
 */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

export interface PopperProps {
  tier: CelebrationTier;
  /** Changes per burst so the particle layout is regenerated each time. */
  seed: number;
}

/**
 * Confetti built from DOM nodes and `motion` — no canvas, no dependency, and
 * nothing for the bundle or the CSP to carry.
 *
 * Renders nothing under reduced motion. The sound and the message still fire,
 * so the moment survives; only the animation is dropped. globals.css disables
 * CSS animation for that preference, but motion animates in JS and ignores it,
 * so this has to be checked here.
 */
/** +1 fires rightward (the left cannon), -1 leftward (the right cannon). */
type Side = 1 | -1;

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  color: string;
  delay: number;
  round: boolean;
}

/**
 * One cannon's worth of particles.
 *
 * Angles are built from an elevation above the horizon rather than from a
 * screen-space bearing, then mirrored with `side`. That way both cannons share
 * one arc definition and are guaranteed symmetric — deriving each barrel's
 * bearing separately would let them drift out of step.
 */
function buildParticles(config: TierConfig, side: Side, seed: number): Particle[] {
  const random = seeded(seed + 1);
  const count = Math.round(config.count / 2);

  return Array.from({ length: count }, (_, i) => {
    // 21.6° to 68.4° above the horizon: a shallow-to-steep fan, averaging
    // roughly 45°, which is the angle a party cannon actually fires at.
    const elevation = Math.PI * (0.12 + random() * 0.26);
    const distance = config.spread * (0.35 + random() * 0.65);
    const [minSize, maxSize] = config.size;
    return {
      id: i,
      x: Math.cos(elevation) * distance * side,
      // Negative is up, since +y is down in screen coordinates.
      y: -Math.sin(elevation) * distance,
      rotate: random() * 720 - 360,
      size: minSize + random() * (maxSize - minSize),
      color: COLORS[Math.floor(random() * COLORS.length)],
      // Back to a tight stagger: the wider one was there to break up a dense
      // burst, and at these counts it would trickle instead.
      delay: random() * 0.12,
      // Mostly paper strips, with a few round pieces mixed in — confetti is
      // cut paper, and an even split of dots read more like bubbles.
      round: random() > 0.78,
    };
  });
}

function Cannon({ config, side, seed }: { config: TierConfig; side: Side; seed: number }) {
  const particles = useMemo(() => buildParticles(config, side, seed), [config, side, seed]);

  return (
    <div className={cn("absolute bottom-8", side === 1 ? "left-10" : "right-10")}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
          animate={{
            x: p.x,
            // Three stops, not two: leave the barrel, reach the peak, fall
            // back past it. A two-stop keyframe starting at the peak would
            // make the particle appear there instantly instead of rising.
            y: [0, p.y, p.y + config.spread * GRAVITY],
            opacity: [1, 1, 0],
            scale: 1,
            rotate: p.rotate,
          }}
          transition={{
            duration: config.duration,
            delay: p.delay,
            // Ballistic: horizontal velocity stays constant while the vertical
            // decelerates on the way up and accelerates on the way down. A
            // single ease across both would float on the descent.
            x: { duration: config.duration, delay: p.delay, ease: "linear" },
            y: {
              duration: config.duration,
              delay: p.delay,
              times: [0, 0.4, 1],
              ease: ["easeOut", "easeIn"],
            },
            opacity: { times: [0, 0.6, 1], duration: config.duration, delay: p.delay },
            scale: { duration: 0.2, delay: p.delay },
          }}
          style={{
            position: "absolute",
            width: p.size,
            // Strips are long rather than square — 1:2.4 is about the aspect
            // of real cut confetti.
            height: p.size * (p.round ? 1 : 2.4),
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "1px",
          }}
        />
      ))}
    </div>
  );
}

export function Popper({ tier, seed }: PopperProps) {
  const reduced = useReducedMotion();
  const config = TIERS[tier];

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Two barrels in the bottom corners, firing inward and up. The seeds are
          offset so the sides are mirrored in aim but not in scatter — identical
          seeds would produce a suspiciously perfect reflection. */}
      <Cannon config={config} side={1} seed={seed} />
      <Cannon config={config} side={-1} seed={seed + 977} />
    </div>
  );
}
