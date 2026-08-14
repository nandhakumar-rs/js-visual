"use client";

import { useMemo, useState } from "react";
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
  /** `isFirstAttempt` is false once "Try another answer" has been used. */
  onAnswered?: (correct: boolean, isFirstAttempt: boolean) => void;
  submitLabel?: string;
  resultNoun?: string;
  /** Optional extra line shown after reveal, e.g. the lab's actual runtime result. */
  actualResultLabel?: string;
}

/** djb2 over the question's own text — stable across renders and reloads. */
function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Fisher-Yates with a seeded generator, so the order is scrambled but fixed for
 * a given question.
 *
 * It has to be deterministic on two counts. The server and the first client
 * render must agree or hydration breaks, and the options must not rearrange
 * themselves underneath someone who is midway through reading them — including
 * after "Try another answer", which re-renders this component.
 */
function shuffleStable<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    // Scale from the top bits, not `s % (i + 1)`. A power-of-two-modulus LCG
    // has famously weak low bits, and taking the remainder reads only those —
    // which piled 58% of correct answers into the last slot.
    const j = Math.floor((s / 4294967296) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
  // Survives "Try another answer", which only resets the selection — so a
  // retried question can never be reported as a first attempt.
  const [attempts, setAttempts] = useState(0);

  // Questions are authored with the correct option written first, which would
  // otherwise make "pick the top one" a winning strategy. Seeded on the
  // question's own text so every question gets a different permutation.
  const shown = useMemo(
    () => shuffleStable(options, hash((prompt ?? "") + options.map((o) => o.id).join("|"))),
    [options, prompt]
  );

  const correct = selected === correctOptionId;
  const selectedOption = options.find((o) => o.id === selected);

  function handleSubmit() {
    if (!selected) return;
    setRevealed(true);
    setAttempts((n) => n + 1);
    onAnswered?.(selected === correctOptionId, attempts === 0);
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
        {shown.map((option) => {
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
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="font-medium">
            {correct ? `✅ Correct ${resultNoun}` : `Your ${resultNoun}: ${selectedOption?.label} ❌`}
          </p>
          {actualResultLabel && <p className="text-muted-foreground">{actualResultLabel}</p>}
          {selectedOption?.feedback && (
            <p className="text-muted-foreground">
              <InlineCodeText text={selectedOption.feedback} />
            </p>
          )}
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
