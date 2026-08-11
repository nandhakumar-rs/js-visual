import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InlineCodeProps {
  children: ReactNode;
  className?: string;
}

/** A code-styled inline span for JS identifiers/snippets embedded in lesson copy. */
export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code className={cn("rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground", className)}>
      {children}
    </code>
  );
}
