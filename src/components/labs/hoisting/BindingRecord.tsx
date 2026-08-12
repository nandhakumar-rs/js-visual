"use client";

import type { ReactNode } from "react";
import { InlineCode } from "@/components/learning/InlineCode";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import { VariableBox, type VariableStatus } from "@/components/visualizers/VariableBox";
import type { BindingPhase, BindingState, HoistingStepState } from "./types";

const PHASE_LABEL: Record<BindingPhase, string> = {
  entering: "Entering the scope",
  preparing: "Preparing declarations",
  "before-declaration": "Running statements — before the declaration line",
  "after-declaration": "Running statements — after the declaration line",
  halted: "Stopped by an error",
};

/** Every state carries a written label, so meaning never depends on color. */
export const STATE_LABEL: Record<BindingState, string> = {
  none: "No binding yet",
  uninitialized: "Uninitialized — Temporal Dead Zone",
  "initialized-undefined": "Initialized with undefined",
  "initialized-value": "Initialized with a value",
  "function-ready": "Function ready — callable",
  halted: "Execution stopped by a ReferenceError",
};

export const STATE_TONE: Record<BindingState, StateBadgeTone> = {
  none: "neutral",
  uninitialized: "changed",
  "initialized-undefined": "neutral",
  "initialized-value": "success",
  "function-ready": "success",
  halted: "error",
};

const VALUE_STATUS: Record<BindingState, VariableStatus> = {
  none: "uninitialized",
  uninitialized: "tdz",
  "initialized-undefined": "undefined",
  "initialized-value": "set",
  "function-ready": "set",
  halted: "error",
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  );
}

export function BindingRecord({ state }: { state: HoistingStepState }) {
  const hasBinding = state.bindingState !== "none";

  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <dl className="divide-y divide-border/60">
        <Row label="Identifier">
          <InlineCode>{state.identifier}</InlineCode>
        </Row>
        <Row label="Declared with">
          <InlineCode>{state.declaredWith === "function" ? "function declaration" : state.declaredWith}</InlineCode>
        </Row>
        <Row label="Phase">
          <span className="text-muted-foreground">{PHASE_LABEL[state.phase]}</span>
        </Row>
        <Row label="State">
          <StateBadge tone={STATE_TONE[state.bindingState]}>{STATE_LABEL[state.bindingState]}</StateBadge>
        </Row>
        <Row label="Current value">
          {hasBinding && state.displayValue ? (
            // VariableBox's own previousValue path re-formats the value (a
            // string would gain quotes), so the transition is rendered here
            // from the already-display-ready strings the step provides.
            <span className="flex flex-wrap items-center gap-1.5">
              {state.previousDisplayValue && (
                <>
                  <span className="font-mono text-xs text-muted-foreground line-through decoration-1">
                    {state.previousDisplayValue}
                  </span>
                  <span aria-hidden className="text-muted-foreground">
                    &rarr;
                  </span>
                </>
              )}
              <VariableBox
                name={state.identifier}
                displayValue={state.displayValue}
                status={VALUE_STATUS[state.bindingState]}
                size="sm"
              />
            </span>
          ) : (
            <span className="text-muted-foreground italic">The binding does not exist yet.</span>
          )}
        </Row>
        <Row label="Read result">
          <span
            className={
              state.bindingState === "uninitialized" || state.bindingState === "halted"
                ? "font-mono text-xs text-destructive"
                : "font-mono text-xs text-muted-foreground"
            }
          >
            {state.readResult}
          </span>
        </Row>
      </dl>
    </div>
  );
}
