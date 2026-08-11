import { ArrowDown } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Our array:</p>
        <Chips values={[1, 2, 3]} />
        <p className="text-sm text-muted-foreground">
          We want to add <InlineCode>4</InlineCode>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4">
          <p className="text-sm font-semibold">Change the existing array</p>
          <Chips values={[1, 2, 3]} />
          <ArrowDown className="size-3.5 text-muted-foreground" aria-hidden />
          <Chips values={[1, 2, 3, 4]} />
          <StateBadge tone="changed">SAME ARRAY CHANGED</StateBadge>
          <p className="pt-1 font-mono text-xs text-muted-foreground">
            <InlineCode>array.push(4)</InlineCode>
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4">
          <p className="text-sm font-semibold">Keep the original, create another array</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">original</p>
              <Chips values={[1, 2, 3]} />
            </div>
            <ArrowDown className="size-3.5 shrink-0 text-muted-foreground sm:hidden" aria-hidden />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">new</p>
              <Chips values={[1, 2, 3, 4]} />
            </div>
          </div>
          <StateBadge tone="new">NEW ARRAY CREATED</StateBadge>
          <p className="pt-1 font-mono text-xs text-muted-foreground">
            <InlineCode>const updated = [...array, 4]</InlineCode>
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">JavaScript gives us both options.</p>

      <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4">
        <p className="mb-1 text-sm text-muted-foreground">
          Here&apos;s what <InlineCode>[...array, 4]</InlineCode> is doing:
        </p>
        <p className="text-center font-mono text-sm">
          [ <InlineCode>...array</InlineCode> , <InlineCode>4</InlineCode> ]
        </p>
        <div className="grid grid-cols-2 gap-3 text-center text-xs text-muted-foreground">
          <p>
            copy the items from <InlineCode>array</InlineCode>
          </p>
          <p>add this new value</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Changing the existing array is called{" "}
        <InfoTooltip label="mutation" code>
          Changing an existing value instead of creating a new one.
        </InfoTooltip>
        . Creating a new array while leaving the old one alone is an{" "}
        <InfoTooltip label="immutable update">
          Updating data by creating a new copy with the change, instead of changing the original.
        </InfoTooltip>
        .
      </p>
    </div>
  );
}
