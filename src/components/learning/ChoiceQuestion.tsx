"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { InlineCodeText } from "./InlineCodeText";
import type { ChoiceOption } from "./types";

export interface ChoiceQuestionProps {
  /** Omit when the surrounding card already asks the question (e.g. PredictionCard's title). */
  prompt?: string;
  code?: string[];
  options: ChoiceOption[];
  correctOptionId: string;
  explanation: string;
  onAnswered?: (correct: boolean) => void;
  submitLabel?: string;
  resultNoun?: string;
  /** Optional extra line shown after reveal, e.g. the lab's actual runtime result. */
  actualResultLabel?: string;
}

export function ChoiceQuestion({
  prompt,
  code,
  options,
  correctOptionId,
  explanation,
  onAnswered,
  submitLabel = "Check answer",
  resultNoun = "answer",
  actualResultLabel,
}: ChoiceQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = selected === correctOptionId;

  function handleSubmit() {
    if (!selected) return;
    setRevealed(true);
    onAnswered?.(selected === correctOptionId);
  }

  function handleRetry() {
    setSelected(null);
    setRevealed(false);
  }

  return (
    <div className="space-y-3">
      {prompt && (
        <p className="text-sm font-medium">
          <InlineCodeText text={prompt} />
        </p>
      )}
      {code && <CodePanel code={code} title="" showLineNumbers={false} />}

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={prompt ?? "Answer options"}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrectOption = option.id === correctOptionId;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={revealed}
              onClick={() => setSelected(option.id)}
              className={cn(
                "flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !revealed &&
                  (isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"),
                revealed && isCorrectOption && "border-emerald-500/60 bg-emerald-500/10",
                revealed && isSelected && !isCorrectOption && "border-destructive/60 bg-destructive/10",
                revealed && !isSelected && !isCorrectOption && "opacity-60"
              )}
            >
              <span>{option.label}</span>
              {revealed && isCorrectOption && <Check className="size-4 text-emerald-600 dark:text-emerald-400" />}
              {revealed && isSelected && !isCorrectOption && <X className="size-4 text-destructive" />}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <Button size="sm" onClick={handleSubmit} disabled={!selected}>
          {submitLabel}
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "space-y-1.5 rounded-md border p-3 text-sm",
            correct ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-500/40 bg-amber-500/5"
          )}
        >
          <p className="font-medium">
            {correct ? `✅ Correct ${resultNoun}` : `Your ${resultNoun}: ${options.find((o) => o.id === selected)?.label} ❌`}
          </p>
          {actualResultLabel && <p className="text-muted-foreground">{actualResultLabel}</p>}
          <p className="text-muted-foreground">
            <InlineCodeText text={explanation} />
          </p>
          <Button size="sm" variant="ghost" onClick={handleRetry} className="mt-1 h-7 px-2 text-xs">
            Try another answer
          </Button>
        </motion.div>
      )}
    </div>
  );
}
