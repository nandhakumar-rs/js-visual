import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { InlineCode } from "@/components/learning/InlineCode";

const SOURCE = [1, 2, 2, 3, 1];
const DUPLICATE_INDICES = new Set([2, 4]);
const UNIQUE = [1, 2, 3];

function ValueChip({ value, isDuplicate }: { value: number; isDuplicate?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-w-10 flex-col items-center justify-center rounded-md border px-2.5 py-1.5 font-mono text-sm",
        isDuplicate ? "border-border bg-muted/40 opacity-70" : "border-border bg-card"
      )}
    >
      <span>{value}</span>
      {isDuplicate && <span className="text-[0.65rem] text-muted-foreground">DUPLICATE</span>}
    </div>
  );
}

function TermRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,auto)_1fr] items-baseline gap-x-3 gap-y-0.5">
      <InlineCode>{term}</InlineCode>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function FlowRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          We have a list of numbers, but some values appear more than once. We want a new array that keeps one of
          each value.
        </p>

        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
          <FlowRow label="ORIGINAL ARRAY">
            <div className="flex flex-wrap gap-1.5">
              {SOURCE.map((value, i) => (
                <ValueChip key={i} value={value} isDuplicate={DUPLICATE_INDICES.has(i)} />
              ))}
            </div>
          </FlowRow>

          <p className="pl-1 text-xs text-muted-foreground">↓ keep first occurrences</p>

          <FlowRow label="SET — UNIQUE VALUES">
            <p className="font-mono text-sm">{`Set(${UNIQUE.length}) { ${UNIQUE.join(", ")} }`}</p>
          </FlowRow>

          <p className="pl-1 text-xs text-muted-foreground">↓ spread into an array</p>

          <FlowRow label="NEW UNIQUE ARRAY">
            <div className="flex flex-wrap gap-1.5">
              {UNIQUE.map((value, i) => (
                <ValueChip key={i} value={value} />
              ))}
            </div>
          </FlowRow>
        </div>

        <p className="text-sm text-muted-foreground">
          A <InlineCode>Set</InlineCode> preserves insertion order, but it does not use numeric indexes like an
          array. You can iterate through its values, and its <InlineCode>size</InlineCode> tells you how many unique
          values it contains.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card/50 p-3">
        <div className="space-y-1.5">
          <p className="text-center font-mono text-sm">const uniqueSet = new Set(values);</p>
          <TermRow term="new Set(values)">reads the array values, one at a time</TermRow>
          <TermRow term="uniqueSet">
            keeps only one occurrence of each value — at this point it is a Set, not an array
          </TermRow>
        </div>

        <div className="space-y-1.5 border-t border-border pt-3">
          <p className="text-center font-mono text-sm">const unique = [...uniqueSet];</p>
          <TermRow term="...uniqueSet">takes the values back out of the Set</TermRow>
          <TermRow term="[...]">collects those values into a new array</TermRow>
          <TermRow term="unique">
            receives <InlineCode>{`[${UNIQUE.join(", ")}]`}</InlineCode>
          </TermRow>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        These two steps are often written together in one line:{" "}
        <InlineCode>const unique = [...new Set(values)];</InlineCode>
      </p>
    </div>
  );
}
