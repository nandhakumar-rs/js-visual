"use client";

import { ArrowRight } from "lucide-react";
import { InlineCode } from "@/components/learning/InlineCode";
import { ScopeBox } from "@/components/visualizers/ScopeBox";
import type { StateBadgeTone } from "@/components/visualizers/StateBadge";
import type { LabVisualizationProps } from "@/types/lab";
import type { ScopeId, ScopeInputs, ScopeStepState, ScopeVarEntry } from "./types";

const SCOPE_LABEL: Record<ScopeId, string> = {
  global: "Global",
  function: "Function",
  block: "Block",
};

function badgeFor(
  scopeId: ScopeId,
  state: ScopeStepState
): { text: string; tone: StateBadgeTone } | undefined {
  const lookups = state.lookups ?? [];
  if (lookups.some((lookup) => lookup.foundIn === scopeId)) {
    return { text: "FOUND", tone: "success" };
  }
  if (lookups.some((lookup) => lookup.path.includes(scopeId) && lookup.foundIn !== scopeId)) {
    return { text: "SEARCHING — LOOK OUTWARD", tone: "changed" };
  }
  if (state.currentScope === scopeId) {
    return { text: "CURRENT SCOPE", tone: "new" };
  }
  return undefined;
}

function toVariables(vars: ScopeVarEntry[]) {
  return vars.map((v) => ({ name: v.name, displayValue: v.displayValue, status: v.status }));
}

export function ScopeVisualization({ step }: LabVisualizationProps<ScopeInputs, ScopeStepState>) {
  const state = step?.state;

  if (!state) {
    return <p className="text-sm text-muted-foreground">Press Run or Step to begin.</p>;
  }

  return (
    <div className="space-y-4">
      <ScopeBox
        label="Global"
        kind="global"
        isActive={state.currentScope === "global"}
        statusBadge={badgeFor("global", state)}
        variables={toVariables(state.globalVars)}
      >
        {state.functionOpen && (
          <ScopeBox
            label="greetUser()"
            kind="function"
            isActive={state.currentScope === "function"}
            statusBadge={badgeFor("function", state)}
            variables={toVariables(state.functionVars)}
            emptyHint={state.functionVars.length === 0 ? "No local variables yet." : undefined}
          >
            {state.blockOpen && (
              <ScopeBox
                label="if (userName)"
                kind="block"
                isActive={state.currentScope === "block"}
                statusBadge={badgeFor("block", state)}
                variables={toVariables(state.blockVars)}
                emptyHint={state.blockVars.length === 0 ? "No local variables yet." : undefined}
              />
            )}
          </ScopeBox>
        )}
      </ScopeBox>

      {state.lookups && state.lookups.length > 0 && (
        <div className="space-y-1.5 rounded-lg border border-border/60 bg-card/30 p-3 text-xs">
          {state.lookups.map((lookup) => (
            <p key={lookup.variable} className="flex flex-wrap items-center gap-1.5">
              <InlineCode>{lookup.variable}</InlineCode>
              <ArrowRight aria-hidden className="size-3 text-muted-foreground" />
              {lookup.path.map((scope, index) => (
                <span key={scope} className="flex items-center gap-1.5">
                  {index > 0 && <ArrowRight aria-hidden className="size-3 text-muted-foreground" />}
                  <span
                    className={
                      scope === lookup.foundIn
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }
                  >
                    {SCOPE_LABEL[scope]}
                  </span>
                </span>
              ))}
              <span className="text-muted-foreground">&middot; found in {SCOPE_LABEL[lookup.foundIn]}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
