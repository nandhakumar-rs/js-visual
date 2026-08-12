"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/learning/InlineCode";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import { buildExperimentCode } from "./experimentCode";
import { lookupVariable, SCOPE_LOCATION_LABEL, type ScopeLocation, type ScopeVariableName } from "./lookup";
import type { ScopeId } from "./types";

const LOCATIONS: readonly ScopeLocation[] = ["global", "function", "block"];
const VARIABLES: readonly ScopeVariableName[] = ["appName", "userName", "message"];

const SCOPE_SHORT_LABEL: Record<ScopeId, string> = {
  global: "Global",
  function: "Function",
  block: "Block",
};

/**
 * A controlled comparison experiment, deliberately independent of the step
 * player above: it owns all of its state locally and receives no props, so
 * changing a control here can never move the player's current step.
 */
export function ScopeExperiment() {
  const [location, setLocation] = useState<ScopeLocation>("function");
  const [variable, setVariable] = useState<ScopeVariableName>("appName");
  const [revealed, setRevealed] = useState(false);

  // Code, highlight line and outcome all derive from the same two controls,
  // so the preview can never describe a different case than the result.
  const { code, readLine } = useMemo(() => buildExperimentCode(location, variable), [location, variable]);
  const result = useMemo(() => lookupVariable(location, variable), [location, variable]);

  // Any control change invalidates the previous answer: the result and its
  // explanation go away together.
  function selectLocation(next: ScopeLocation) {
    setLocation(next);
    setRevealed(false);
  }

  function selectVariable(next: ScopeVariableName) {
    setVariable(next);
    setRevealed(false);
  }

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Try it yourself</p>
        <p className="text-xs text-muted-foreground">
          A separate experiment from the player above — move the read into a different scope, predict the result, then
          check it. The three declarations never move.
        </p>
      </div>

      <div className="grid gap-3 @md:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="Read from"
          options={LOCATIONS}
          value={location}
          onChange={selectLocation}
          optionLabel={(loc) => SCOPE_LOCATION_LABEL[loc]}
        />
        <SegmentedControl
          label="Variable to read"
          options={VARIABLES}
          value={variable}
          onChange={selectVariable}
          optionLabel={(v) => v}
          mono
        />
      </div>

      {/* Both columns start directly with their panel, so their tops line up.
          The code panel carries its own "Generated code" title bar instead of
          an external label. */}
      <div className="grid gap-3 @2xl:grid-cols-2 @2xl:items-start">
        <div className="min-w-0">
          <CodePanel code={code} activeLines={[readLine]} title="Generated code" />
        </div>

        <div className="min-w-0">
          {!revealed ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3">
              <p className="text-sm font-medium">What happens at the highlighted line?</p>
              <p className="text-xs text-muted-foreground">
                Make your prediction, then check it against what JavaScript actually does.
              </p>
              <Button type="button" size="sm" onClick={() => setRevealed(true)} className="w-full @md:w-auto">
                Check result
              </Button>
            </div>
          ) : (
            <motion.div
              key={`${location}-${variable}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Searched:</span>
                {result.searchPath.map((scope, index) => (
                  <motion.span
                    key={scope}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3, duration: 0.25 }}
                    className="flex items-center gap-1.5"
                  >
                    {index > 0 && <ArrowRight aria-hidden className="size-3 text-muted-foreground" />}
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-medium",
                        result.accessible && scope === result.foundIn
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {SCOPE_SHORT_LABEL[scope]}
                    </span>
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: result.searchPath.length * 0.3, duration: 0.25 }}
                className="space-y-2"
              >
                {result.accessible ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <StateBadge tone="success">FOUND</StateBadge>
                      <VariableBox name={variable} displayValue={result.value ?? undefined} status="set" size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <InlineCode>{variable}</InlineCode> resolves in the{" "}
                      <strong>{SCOPE_SHORT_LABEL[result.foundIn as ScopeId]}</strong> scope — the search starts where
                      the read happens and moves outward until it finds a match.
                    </p>
                  </>
                ) : (
                  <>
                    <StateBadge tone="error">NOT ACCESSIBLE</StateBadge>
                    <p className="font-mono text-xs text-destructive">
                      Uncaught ReferenceError: {variable} is not defined
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <InlineCode>{variable}</InlineCode> is declared in a scope nested deeper than this one.
                      JavaScript searches outward, never inward, so it reaches the end of the chain without finding it.
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
