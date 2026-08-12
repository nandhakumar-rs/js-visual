"use client";

import { useId, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// w-fit keeps the track the width of its pills instead of stretching across
// the whole control bar, while still allowing the pills to wrap onto a second
// row when the container is genuinely narrower than the content.
const groupVariants = cva("flex w-fit flex-wrap rounded-lg border border-border bg-muted/30", {
  variants: {
    size: {
      sm: "gap-1 p-1",
      // min-h-8 (not h-8) matches the Input primitive's height on the common
      // single-row case, without clipping a second row when the pills wrap.
      md: "min-h-8 items-center gap-1 p-0.5",
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
        // A primary tint plus a primary outline, not a lifted surface: in the
        // dark theme --background and --card are the same token, so a
        // surface-based "selected" state is invisible against the card the
        // control bar sits on. The ring is what carries the state at a glance.
        true: "bg-primary/15 font-semibold text-foreground ring-1 ring-primary/60",
        false: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
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
   * - "none"    — nothing visible; `label` is still the group's aria-label.
   *               Use for chrome toggles that are clear from context.
   */
  labelAs?: "label" | "caption" | "none";
  /**
   * Helper text below the group, describing the currently selected option.
   * Wired to the group with aria-describedby.
   */
  description?: ReactNode;
  className?: string;
}

/**
 * The pill radiogroup used everywhere this app offers a small set of mutually
 * exclusive choices, in two sizes.
 *
 * Convention:
 * - control bars (`LabDefinition.simulationControls`, classic `Controls`) use
 *   size="md" with labelAs="label", matching the Input/Label pairs beside them;
 * - experiment panels (`LabDefinition.experimentPanel`) use size="sm" with
 *   labelAs="caption", matching their text-xs surroundings.
 *
 * Options never wrap mid-label (`whitespace-nowrap`), and the group is sized to
 * its content, so a narrow container stacks the pills instead of squeezing them.
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
  description,
  className,
}: SegmentedControlProps<T>) {
  const descriptionId = useId();

  return (
    <div className={cn("min-w-0", size === "md" ? "space-y-1" : "space-y-1.5", className)}>
      {labelAs === "label" && <Label>{label}</Label>}
      {labelAs === "caption" && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
      <div
        role="radiogroup"
        aria-label={label}
        aria-describedby={description ? descriptionId : undefined}
        className={groupVariants({ size })}
      >
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
      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
