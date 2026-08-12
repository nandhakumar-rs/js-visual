"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/learning/InlineCode";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import { lookupVariable, SCOPE_LOCATION_LABEL, type LookupResult, type ScopeLocation, type ScopeVariableName } from "./lookup";
import type { ScopeId } from "./types";

const LOCATIONS: ScopeLocation[] = ["global", "function", "block"];
const VARIABLES: ScopeVariableName[] = ["appName", "userName", "message"];

const SCOPE_SHORT_LABEL: Record<ScopeId, string> = {
  global: "Global",
  function: "Function",
  block: "Block",
};

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  optionLabel,
  mono,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (next: T) => void;
  optionLabel: (option: T) => string;
  mono?: boolean;
}) {
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

export function ScopeExperiment() {
  const [location, setLocation] = useState<ScopeLocation>("function");
  const [variable, setVariable] = useState<ScopeVariableName>("appName");
  const [checkId, setCheckId] = useState(0);
  const [result, setResult] = useState<LookupResult | null>(null);

  function handleCheck() {
    setResult(lookupVariable(location, variable));
    setCheckId((id) => id + 1);
  }

  return (
    <div className="@container space-y-3 rounded-lg border border-border bg-card/40 p-3">
      <p className="text-sm font-semibold">Try it yourself</p>

      <div className="grid gap-3 @lg:grid-cols-[3fr_2fr]">
        <SegmentedControl
          label="Current location"
          options={LOCATIONS}
          value={location}
          onChange={setLocation}
          optionLabel={(loc) => SCOPE_LOCATION_LABEL[loc]}
        />
        <SegmentedControl
          label="Variable to read"
          options={VARIABLES}
          value={variable}
          onChange={setVariable}
          optionLabel={(v) => v}
          mono
        />
      </div>

      <Button type="button" size="sm" onClick={handleCheck} className="w-full @lg:w-auto">
        Check access
      </Button>

      {result && (
        <div
          key={checkId}
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
          >
            {result.accessible ? (
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge tone="success">FOUND</StateBadge>
                <span className="text-sm">
                  <InlineCode>{variable}</InlineCode> resolves in the{" "}
                  <strong>{SCOPE_SHORT_LABEL[result.foundIn as ScopeId]}</strong> scope.
                </span>
                <VariableBox name={variable} displayValue={result.value ?? undefined} status="set" size="sm" />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <StateBadge tone="error">NOT ACCESSIBLE</StateBadge>
                  <span className="text-sm">JavaScript cannot search inward into a scope it isn&apos;t inside.</span>
                </div>
                <p className="font-mono text-xs text-destructive">
                  Uncaught ReferenceError: {variable} is not defined
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
