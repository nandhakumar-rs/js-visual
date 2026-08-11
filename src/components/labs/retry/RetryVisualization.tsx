"use client";

import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabVisualizationProps } from "@/types/lab";
import type { RetryInputs, RetryStepState } from "./types";

export function RetryVisualization({ step }: LabVisualizationProps<RetryInputs, RetryStepState>) {
  const state = step?.state ?? { attempts: [] };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {state.attempts.map((a) => (
          <div
            key={a.n}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm",
              a.status === "success" && "border-emerald-500/50 bg-emerald-500/10",
              a.status === "failed" && "border-destructive/40 bg-destructive/5",
              a.status === "gave-up" && "border-destructive/50 bg-destructive/10"
            )}
          >
            {a.status === "success" && <Check className="size-4 text-emerald-600 dark:text-emerald-400" />}
            {a.status !== "success" && <X className="size-4 text-destructive" />}
            <span>
              Attempt #{a.n} — {a.status === "success" ? "Success" : a.status === "gave-up" ? "Gave up" : "Failed"}
            </span>
          </div>
        ))}
      </div>
      {state.waitingMs !== undefined && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          waiting {state.waitingMs}ms...
        </div>
      )}
    </div>
  );
}
