"use client";

import { motion, AnimatePresence } from "motion/react";
import { useExplanationMode } from "@/lib/ui-state/explanation-mode-store";
import { ExplanationModeToggle } from "@/components/layout/ExplanationModeToggle";
import { InlineCodeText } from "./InlineCodeText";
import type { Concept } from "@/types/concept";

export interface ExplanationPanelProps {
  concept: Concept;
}

export function ExplanationPanel({ concept }: ExplanationPanelProps) {
  const mode = useExplanationMode((s) => s.mode);
  const text = mode === "simple" ? concept.simpleDescription : concept.technicalDescription;

  return (
    <div className="max-w-3xl space-y-2">
      <ExplanationModeToggle />
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-base text-muted-foreground sm:text-lg"
        >
          <InlineCodeText text={text} />
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
