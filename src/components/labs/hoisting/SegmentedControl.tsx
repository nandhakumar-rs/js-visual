"use client";

import { cn } from "@/lib/utils";

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  optionLabel: (option: T) => string;
  mono?: boolean;
}

/**
 * Pill-style radio group used by both this lesson's scenario selector and its
 * "Try it yourself" panel. Options never wrap mid-label (`whitespace-nowrap`),
 * and the group fills its column rather than shrinking to fit, so a narrow
 * container stacks the pills instead of squeezing them.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  optionLabel,
  mono,
}: SegmentedControlProps<T>) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1"
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
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                mono && "font-mono",
                isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {optionLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
