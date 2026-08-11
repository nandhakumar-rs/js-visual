"use client";

import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InlineCode } from "./InlineCode";

export interface InfoTooltipProps {
  /** The term shown as the trigger text, e.g. "undefined". */
  label: string;
  /** The short definition shown on hover/focus. */
  children: ReactNode;
  /** Render the trigger as inline code instead of a dotted-underline glossary term — for terms that are also JS identifiers (`undefined`, `null`, `typeof`). */
  code?: boolean;
  className?: string;
}

/**
 * Glossary-style hover tooltip for lesson terms. Reuses the same
 * @base-ui/react/tooltip primitives as ui/tooltip.tsx, but with a wider,
 * paragraph-friendly popup — the default TooltipContent is styled for
 * single-line chrome hints, not multi-sentence definitions.
 */
export function InfoTooltip({ label, children, code, className }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "inline-flex cursor-help items-center gap-0.5",
          code
            ? "align-middle"
            : "font-medium text-foreground underline decoration-dotted decoration-muted-foreground/60 underline-offset-2",
          className
        )}
      >
        {code ? <InlineCode>{label}</InlineCode> : label}
        <Info className="size-3 text-muted-foreground" aria-hidden />
      </TooltipTrigger>
      <TooltipContent className="w-64 max-w-64 flex-col items-start whitespace-normal text-left text-[0.8rem] leading-relaxed">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
