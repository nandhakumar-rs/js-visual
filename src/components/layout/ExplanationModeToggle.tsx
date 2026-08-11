"use client";

import { useExplanationMode } from "@/lib/ui-state/explanation-mode-store";
import { cn } from "@/lib/utils";

export function ExplanationModeToggle() {
  const mode = useExplanationMode((s) => s.mode);
  const setMode = useExplanationMode((s) => s.setMode);

  return (
    <div
      role="radiogroup"
      aria-label="Explanation detail level"
      className="inline-flex items-center rounded-md border border-border bg-muted/40 p-0.5 text-xs"
    >
      {(["simple", "technical"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={mode === option}
          onClick={() => setMode(option)}
          className={cn(
            "rounded px-2.5 py-1 capitalize transition-colors",
            mode === option
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
