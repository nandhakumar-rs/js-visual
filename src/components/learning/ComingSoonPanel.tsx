import { Construction } from "lucide-react";
import type { Concept } from "@/types/concept";

export interface ComingSoonPanelProps {
  concept: Concept;
}

export function ComingSoonPanel({ concept }: ComingSoonPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <Construction className="size-8 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">The {concept.title} lab isn&apos;t built yet.</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        This concept is on the roadmap. Check back soon — every other lab in
        JavaScript Visual Lab is fully interactive, so this one will be too.
      </p>
    </div>
  );
}
