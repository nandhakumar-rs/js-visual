import { ArrowDown, Plus } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { StateBadge } from "@/components/visualizers/StateBadge";

function Chips({ values }: { values: number[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v, i) => (
        <span
          key={i}
          className="flex min-w-8 items-center justify-center rounded-md border border-border bg-card px-2 py-1 font-mono text-sm"
        >
          {v}
        </span>
      ))}
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <InfoTooltip label="Concatenate">
            To join two or more things together, one after another.
          </InfoTooltip>{" "}
          is a technical word for joining things together. We have two arrays, but we want one array
          containing all their items.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border border-border bg-card/50 px-4 py-2.5">
          <div className="space-y-1 text-center">
            <p className="text-xs text-muted-foreground">
              SOURCE A — <InlineCode>a</InlineCode>
            </p>
            <Chips values={[1, 2]} />
          </div>
          <Plus className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="space-y-1 text-center">
            <p className="text-xs text-muted-foreground">
              SOURCE B — <InlineCode>b</InlineCode>
            </p>
            <Chips values={[3, 4]} />
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="text-center text-xs font-medium text-muted-foreground">JOIN IN ORDER</p>
        <div className="flex justify-center">
          <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
        </div>
        <div className="space-y-1.5 text-center">
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            NEW RESULT — <InlineCode>result</InlineCode>
            <StateBadge tone="new">NEW ARRAY CREATED</StateBadge>
          </p>
          <div className="flex justify-center">
            <Chips values={[1, 2, 3, 4]} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <InlineCode>a</InlineCode> stays <InlineCode>[1, 2]</InlineCode>
            <StateBadge tone="neutral">UNCHANGED</StateBadge>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <InlineCode>b</InlineCode> stays <InlineCode>[3, 4]</InlineCode>
            <StateBadge tone="neutral">UNCHANGED</StateBadge>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          JavaScript provides a method named <InlineCode>concat()</InlineCode> for this.
        </p>
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="mb-3 text-center font-mono text-sm">
            <InlineCode>a</InlineCode>.concat(<InlineCode>b</InlineCode>)
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            <p>start with this array</p>
            <p>join another array</p>
            <p>
              add the items from <InlineCode>b</InlineCode>
            </p>
          </div>
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
            const result = a.concat(b);
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          JavaScript reads <InlineCode>a</InlineCode> first, then <InlineCode>b</InlineCode>, so the order
          becomes <InlineCode>[1, 2, 3, 4]</InlineCode>.
        </p>
      </div>
    </div>
  );
}
