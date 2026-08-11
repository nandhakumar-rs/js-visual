"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type VariableStatus =
  | "uninitialized"
  | "tdz"
  | "undefined"
  | "null"
  | "set"
  | "updated"
  | "error";

const boxVariants = cva(
  "inline-flex flex-col items-center justify-center rounded-md border font-mono transition-colors",
  {
    variants: {
      status: {
        uninitialized: "border-dashed border-muted-foreground/40 bg-muted/40 text-muted-foreground",
        tdz: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        undefined: "border-border bg-muted/50 text-muted-foreground",
        null: "border-border bg-muted/50 text-muted-foreground italic",
        set: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        updated: "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-400",
        error: "border-destructive/50 bg-destructive/10 text-destructive",
      },
      size: {
        sm: "min-w-12 px-2 py-1 text-xs gap-0",
        md: "min-w-16 px-3 py-1.5 text-sm gap-0.5",
        lg: "min-w-20 px-4 py-2 text-base gap-0.5",
      },
    },
    defaultVariants: { status: "set", size: "md" },
  }
);

export interface VariableBoxProps extends VariantProps<typeof boxVariants> {
  name?: string;
  value?: unknown;
  displayValue?: string;
  previousValue?: unknown;
  highlighted?: boolean;
  className?: string;
}

function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "function") return "ƒ";
  if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function VariableBox({
  name,
  value,
  displayValue,
  previousValue,
  status,
  size,
  highlighted,
  className,
}: VariableBoxProps) {
  const shown = displayValue ?? formatValue(value);
  const showTransition =
    previousValue !== undefined &&
    formatValue(previousValue) !== shown &&
    status !== "uninitialized" &&
    status !== "tdz";

  return (
    <div
      className={cn(
        boxVariants({ status, size }),
        highlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
      role="group"
      aria-label={name ? `Variable ${name}: ${shown}` : `Value: ${shown}`}
    >
      {name && <span className="text-[0.65em] uppercase tracking-wide opacity-70">{name}</span>}
      <span className="flex items-center gap-1.5 leading-none">
        {showTransition && (
          <>
            <span className="opacity-50 line-through decoration-1">
              {formatValue(previousValue)}
            </span>
            <span aria-hidden>→</span>
          </>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={shown}
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="font-semibold"
          >
            {shown}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
