"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VariableBox } from "@/components/visualizers/VariableBox";
import type { LabVisualizationProps } from "@/types/lab";
import type { ModulesInputs, ModulesStepState } from "./types";

export function ModulesVisualization({
  step,
  inputs,
}: LabVisualizationProps<ModulesInputs, ModulesStepState>) {
  const state = step?.state ?? { mathDefined: false, imported: false };
  const exportsLabel = inputs.exportStyle === "named" ? "add, multiply" : "default: add";

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div
        className={cn(
          "rounded-lg border p-3 text-center",
          state.mathDefined ? "border-primary bg-primary/5" : "border-border"
        )}
      >
        <p className="text-sm font-semibold">math.js</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">exports: {exportsLabel}</p>
      </div>

      {state.imported && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center text-xs text-muted-foreground"
        >
          <span>import</span>
          <ArrowRight className="size-4" aria-hidden />
        </motion.div>
      )}

      <div
        className={cn(
          "rounded-lg border p-3 text-center",
          state.imported ? "border-primary bg-primary/5" : "border-border"
        )}
      >
        <p className="text-sm font-semibold">app.js</p>
        {state.result !== undefined && <VariableBox name="add(2, 3)" value={state.result} status="updated" size="sm" />}
      </div>
    </div>
  );
}
