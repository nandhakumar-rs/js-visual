"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StateBadge, type StateBadgeTone } from "./StateBadge";
import { VariableBox, type VariableStatus } from "./VariableBox";

export interface VariableEntry {
  name: string;
  value?: unknown;
  displayValue?: string;
  status: VariableStatus;
  previousValue?: unknown;
}

export interface ScopeBoxProps {
  id?: string;
  label: string;
  kind?: "global" | "function" | "block" | "closure";
  variables: VariableEntry[];
  isActive?: boolean;
  /** Small status pill next to the kind label, e.g. { text: "CURRENT SCOPE", tone: "new" } or { text: "FOUND", tone: "success" }. */
  statusBadge?: { text: string; tone: StateBadgeTone };
  children?: ReactNode;
  className?: string;
  emptyHint?: string;
}

const KIND_LABEL: Record<NonNullable<ScopeBoxProps["kind"]>, string> = {
  global: "Global Scope",
  function: "Function Scope",
  block: "Block Scope",
  closure: "Closure",
};

export function ScopeBox({
  label,
  kind = "function",
  variables,
  isActive,
  statusBadge,
  children,
  className,
  emptyHint,
}: ScopeBoxProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-lg border bg-card/50 p-3",
        isActive ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border",
        kind === "closure" && "border-dashed",
        className
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="flex flex-wrap items-center gap-1.5">
          {statusBadge && <StateBadge tone={statusBadge.tone}>{statusBadge.text}</StateBadge>}
          <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            {KIND_LABEL[kind]}
          </span>
        </span>
      </div>

      {variables.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {variables.map((v) => (
            <VariableBox
              key={v.name}
              name={v.name}
              value={v.value}
              displayValue={v.displayValue}
              status={v.status}
              previousValue={v.previousValue}
              size="sm"
            />
          ))}
        </div>
      ) : emptyHint ? (
        <p className="text-xs text-muted-foreground italic">{emptyHint}</p>
      ) : null}

      {children && <div className="mt-3 space-y-2 border-t border-border/60 pt-3">{children}</div>}
    </motion.div>
  );
}
