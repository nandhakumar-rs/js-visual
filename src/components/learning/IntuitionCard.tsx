import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { IntuitionCardTone } from "./types";

const cardVariants = cva("flex flex-col gap-1.5 rounded-lg border p-4", {
  variants: {
    tone: {
      muted: "border-dashed border-muted-foreground/40 bg-muted/40",
      highlight: "border-amber-500/40 bg-amber-500/10",
      positive: "border-emerald-500/40 bg-emerald-500/10",
    } satisfies Record<IntuitionCardTone, string>,
  },
  defaultVariants: { tone: "muted" },
});

export interface IntuitionCardProps extends VariantProps<typeof cardVariants> {
  label: string;
  value: string;
  caption: string;
  className?: string;
}

/**
 * A static, plain-language card for a lesson's "Experience" phase — no code,
 * no jargon, just what a value means in human terms. Reusable across future
 * guided lessons' own intuition-building intros.
 */
export function IntuitionCard({ label, value, caption, tone, className }: IntuitionCardProps) {
  return (
    <div className={cn(cardVariants({ tone }), className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-mono text-xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{caption}</p>
    </div>
  );
}
