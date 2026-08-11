"use client";

import type { ReactNode } from "react";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineCodeText } from "./InlineCodeText";

export interface ExperimentControlsProps {
  prompt?: string;
  /** Only reveal once the guided walkthrough has been completed at least once. */
  visible: boolean;
  onRun: () => void;
  children: ReactNode;
}

/**
 * Inline "try it yourself" block for a guided lesson's player — lets the
 * learner tweak an input and re-run the same visualization without ever
 * leaving the area they're already looking at. Reusable across future
 * guided lessons (map, sorting, closures, debounce, promises, ...).
 */
export function ExperimentControls({ prompt, visible, onRun, children }: ExperimentControlsProps) {
  if (!visible) return null;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/40 p-4">
      <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-4" aria-hidden />
        Walkthrough complete
      </p>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Try it yourself</p>
        {prompt && (
          <p className="text-sm text-muted-foreground">
            <InlineCodeText text={prompt} />
          </p>
        )}
        {children}
      </div>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onRun}>
        <PlayCircle className="size-4" aria-hidden />
        Run again
      </Button>
    </div>
  );
}
