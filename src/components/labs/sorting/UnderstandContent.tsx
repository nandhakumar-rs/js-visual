import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { StateBadge } from "@/components/visualizers/StateBadge";

const SOURCE = [10, 1, 2, 20];
const NUMERIC_SORTED = [1, 2, 10, 20];
const TEXT_SOURCE = ["10", "1", "2", "20"];
const TEXT_SORTED = ["1", "10", "2", "20"];
const DEFAULT_RESULT = [1, 10, 2, 20];

function ValueChip({ value }: { value: number | string }) {
  return (
    <div className="flex min-w-10 flex-col items-center justify-center rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-sm">
      {value}
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">
          We have four numbers. We want to arrange them from smallest to largest.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {SOURCE.map((v, i) => (
              <ValueChip key={i} value={v} />
            ))}
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex flex-wrap gap-1.5">
            {NUMERIC_SORTED.map((v, i) => (
              <ValueChip key={i} value={v} />
            ))}
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground">Smallest → largest</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          To sort values, JavaScript repeatedly asks: which of these two values should come first?
        </p>
        <div className="grid gap-3 sm:grid-cols-[2fr_3fr] sm:items-start">
          <div className="space-y-1.5 rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">COMPARE AS NUMBERS</p>
            <p className="font-mono text-sm">
              10 and 2 <span className="text-muted-foreground">→</span> 2 comes first
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {NUMERIC_SORTED.map((v, i) => (
                <ValueChip key={i} value={v} />
              ))}
            </div>
          </div>
          <div className="space-y-1.5 rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">COMPARE AS TEXT</p>
            <div className="space-y-3 pt-1">
              <p className="text-center font-mono text-sm">[{TEXT_SOURCE.map((v) => `"${v}"`).join(", ")}]</p>
              <p className="text-center font-mono text-xs text-muted-foreground">↓</p>
              <p className="text-center font-mono text-sm">[{TEXT_SORTED.map((v) => `"${v}"`).join(", ")}]</p>
              <p className="text-center font-mono text-xs text-muted-foreground">↓</p>
              <div className="space-y-1.5 text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  DEFAULT <InlineCode>sort()</InlineCode> RESULT
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {DEFAULT_RESULT.map((v, i) => (
                    <ValueChip key={i} value={v} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          As text, <InlineCode>&quot;10&quot;</InlineCode> begins with <InlineCode>&quot;1&quot;</InlineCode>, so it
          comes before values beginning with <InlineCode>&quot;2&quot;</InlineCode>. That is why default sorting is
          usually unsuitable for numbers — this is{" "}
          <InfoTooltip label="text order">
            Values are compared character by character as strings, the same way words would be alphabetized —
            sometimes called lexicographic order.
          </InfoTooltip>
          , not numeric order.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card/50 p-3">
        <div className="space-y-1 text-center">
          <p className="text-xs font-medium text-muted-foreground">ASCENDING COMPARATOR</p>
          <p className="font-mono text-sm">numbers.sort((a, b) =&gt; a - b);</p>
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">HOW TO READ THE RESULT</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="space-y-1 rounded-md bg-muted/30 p-2">
              <p className="text-sm">
                <strong className="font-semibold text-foreground">Negative</strong>
                <span className="text-muted-foreground">
                  {" "}
                  — <InlineCode>a</InlineCode> comes first
                </span>
              </p>
              <InlineCode>2 - 10 = -8</InlineCode>
              <p className="text-xs text-muted-foreground">2 comes before 10</p>
            </div>
            <div className="space-y-1 rounded-md bg-muted/30 p-2">
              <p className="text-sm">
                <strong className="font-semibold text-foreground">Positive</strong>
                <span className="text-muted-foreground">
                  {" "}
                  — <InlineCode>b</InlineCode> comes first
                </span>
              </p>
              <InlineCode>20 - 10 = 10</InlineCode>
              <p className="text-xs text-muted-foreground">10 comes before 20</p>
            </div>
            <div className="space-y-1 rounded-md bg-muted/30 p-2">
              <p className="text-sm">
                <strong className="font-semibold text-foreground">Zero</strong>
                <span className="text-muted-foreground"> — equal for sorting</span>
              </p>
              <InlineCode>2 - 2 = 0</InlineCode>
              <p className="text-xs text-muted-foreground">same ordering position</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">SORTING DIRECTION</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-0.5 rounded-md bg-muted/30 p-2">
              <p className="text-xs font-semibold text-foreground">Ascending</p>
              <InlineCode>(a, b) =&gt; a - b</InlineCode>
            </div>
            <div className="space-y-0.5 rounded-md bg-muted/30 p-2">
              <p className="text-xs font-semibold text-foreground">Descending</p>
              <InlineCode>(a, b) =&gt; b - a</InlineCode>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Watch what happens to the original array in each case.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">sort() — SAME ARRAY CHANGED</p>
            <p className="font-mono text-sm">const sorted = numbers.sort((a, b) =&gt; a - b);</p>
            <p className="text-sm text-muted-foreground">
              numbers → <InlineCode>[1, 2, 10, 20]</InlineCode>
            </p>
            <p className="text-sm text-muted-foreground">
              sorted → <InlineCode>[1, 2, 10, 20]</InlineCode>
            </p>
            <p className="text-sm text-muted-foreground">
              sorted === numbers → <InlineCode>true</InlineCode>
            </p>
            <StateBadge tone="changed">SAME ARRAY MUTATED</StateBadge>
          </div>
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">toSorted() — ORIGINAL PRESERVED</p>
            <p className="font-mono text-sm">const sorted = numbers.toSorted((a, b) =&gt; a - b);</p>
            <p className="text-sm text-muted-foreground">
              numbers → <InlineCode>[10, 1, 2, 20]</InlineCode>
            </p>
            <p className="text-sm text-muted-foreground">
              sorted → <InlineCode>[1, 2, 10, 20]</InlineCode>
            </p>
            <p className="text-sm text-muted-foreground">
              sorted === numbers → <InlineCode>false</InlineCode>
            </p>
            <StateBadge tone="new">NEW ARRAY CREATED</StateBadge>
          </div>
        </div>
      </div>
    </div>
  );
}
