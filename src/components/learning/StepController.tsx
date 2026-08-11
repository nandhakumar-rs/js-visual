"use client";

import { AnimatePresence, motion } from "motion/react";
import { StepControls } from "@/components/visualizers/StepControls";
import type { ExecutionEngine } from "@/lib/execution/useExecutionEngine";
import { cn } from "@/lib/utils";
import { InlineCodeText } from "./InlineCodeText";

export interface StepControllerProps {
  // Only reads engine fields that don't depend on the lab's state shape
  // (steps/currentIndex/status/speed/currentStep.title|description), so the
  // state generic is intentionally erased here.
  engine: ExecutionEngine<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
}

export function StepController({ engine, className }: StepControllerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <StepControls
        currentIndex={engine.currentIndex}
        totalSteps={engine.steps.length}
        status={engine.status}
        speed={engine.speed}
        onNext={engine.next}
        onPrevious={engine.previous}
        onPlay={engine.play}
        onPause={engine.pause}
        onReset={engine.reset}
        onSpeedChange={engine.setSpeed}
      />
      <AnimatePresence mode="wait" initial={false}>
        {engine.currentStep && (
          <motion.div
            key={engine.currentStep.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-md border border-border/60 bg-muted/30 px-3 py-2"
          >
            <p className="text-sm font-medium">{engine.currentStep.title}</p>
            <p className="text-xs text-muted-foreground">
              <InlineCodeText text={engine.currentStep.description} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
