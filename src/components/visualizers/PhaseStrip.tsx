"use client";

import { cn } from "@/lib/utils";

export interface PhaseStripStage {
  id: string;
  label: string;
}

export interface PhaseStripProps {
  /** The stages in order. Three is the shape this is tuned for. */
  stages: PhaseStripStage[];
  /** Which stage is current. Labs that track more phases than stages resolve the mapping themselves. */
  currentId: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * A compact "where are we in the process" indicator for a lab's visualization.
 *
 * Laid out as equal grid cells with no connectors between them: a long label
 * wraps inside its own cell, so it can never push a dangling arrow onto the
 * next line the way a wrapping flex row of "label → label → label" does.
 *
 * The current cell is marked with a left accent bar rather than the tint-plus-
 * ring that SegmentedControl uses for a selected tab. This strip is a passive
 * indicator, so it must not borrow the visual language of a control.
 */
export function PhaseStrip({ stages, currentId, ariaLabel = "Current phase", className }: PhaseStripProps) {
  return (
    <ol
      aria-label={ariaLabel}
      className={cn("grid grid-cols-1 gap-1.5 sm:grid-cols-3", className)}
    >
      {stages.map((stage, index) => {
        const isCurrent = stage.id === currentId;
        return (
          <li
            key={stage.id}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "min-w-0 space-y-0.5 rounded-md border border-l-2 px-2 py-1.5",
              isCurrent
                ? "border-primary/25 border-l-primary bg-primary/10 text-foreground"
                : "border-transparent border-l-transparent bg-muted text-muted-foreground"
            )}
          >
            <span className="block text-[0.65rem] font-semibold uppercase tracking-wide opacity-70">
              {index + 1}
            </span>
            <span className="block text-[0.7rem] font-semibold leading-snug">{stage.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
