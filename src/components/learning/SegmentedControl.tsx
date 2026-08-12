"use client";

import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const groupVariants = cva("flex flex-wrap rounded-lg border border-border bg-muted/30", {
  variants: {
    size: {
      sm: "gap-1 p-1",
      // h-8 matches the Input primitive, so a control bar can put pills and
      // text fields on the same row without them disagreeing in height.
      md: "h-8 items-center gap-1 p-0.5",
    },
  },
  defaultVariants: { size: "sm" },
});

const optionVariants = cva(
  "whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      size: {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
      active: {
        true: "bg-background text-foreground shadow-sm",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: { size: "sm", active: false },
  }
);

export interface SegmentedControlProps<T extends string> extends VariantProps<typeof groupVariants> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  optionLabel: (option: T) => ReactNode;
  /** Render option text in the mono face — for options that are literal code (`var`, `let`). */
  mono?: boolean;
  /**
   * How the group's label is rendered:
   * - "label"   — the shadcn <Label> (text-sm). Use in a lesson's control bar,
   *               where it sits alongside <Label>-ed Input fields.
   * - "caption" — a muted text-xs caption. Use inside an experiment panel,
   *               whose surrounding copy is text-xs.
   */
  labelAs?: "label" | "caption";
  className?: string;
}

/**
 * The pill radiogroup used by every guided lesson, in two sizes.
 *
 * Convention across the JavaScript Foundations lessons:
 * - control bars (`LabDefinition.simulationControls`) use size="md" with
 *   labelAs="label", matching the Input/Label pairs beside them;
 * - experiment panels (`LabDefinition.experimentPanel`) use size="sm" with
 *   labelAs="caption", matching their text-xs surroundings.
 *
 * Options never wrap mid-label (`whitespace-nowrap`), and the group fills its
 * column rather than shrinking to fit, so a narrow container stacks the pills
 * instead of squeezing them.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  optionLabel,
  mono,
  size = "sm",
  labelAs = "caption",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("min-w-0", size === "md" ? "space-y-1" : "space-y-1.5", className)}>
      {labelAs === "label" ? (
        <Label>{label}</Label>
      ) : (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <div role="radiogroup" aria-label={label} className={groupVariants({ size })}>
        {options.map((option) => {
          const isActive = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option)}
              className={cn(optionVariants({ size, active: isActive }), mono && "font-mono")}
            >
              {optionLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
