import { ArrowRight } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";

function VariableLabel({ children }: { children: string }) {
  return (
    <div className="flex h-7 min-w-[4.75rem] items-center justify-center rounded-md border border-border bg-card px-2 font-mono text-xs text-muted-foreground">
      {children}
    </div>
  );
}

function BracketRow({
  companionLabel,
  badgeText,
  badgeTone,
  values,
  revealLast,
}: {
  companionLabel: string;
  badgeText: string;
  badgeTone: "neutral" | "changed" | "new";
  values: number[];
  revealLast?: boolean;
}) {
  return (
    <div className="lg:mx-auto lg:max-w-md">
      <div className="flex items-stretch gap-2">
        <div className="flex flex-col justify-around gap-1.5">
          <VariableLabel>original</VariableLabel>
          <VariableLabel>{companionLabel}</VariableLabel>
        </div>
        <div className="flex items-stretch" aria-hidden>
          <div className="w-3 rounded-r-md border-y border-r border-muted-foreground/40" />
        </div>
        <div className="flex items-center">
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <div className="space-y-1.5">
          <StateBadge tone={badgeTone}>{badgeText}</StateBadge>
          <ArrayVisualizer
            items={values.map((v, i) => ({
              id: `${companionLabel}-${i}`,
              label: String(v),
              status: revealLast && i === values.length - 1 ? "added" : "default",
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      {/* Stage A: copying a primitive value */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Start with one number, then copy it into another variable.</p>
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <div className="flex flex-wrap items-center gap-4 lg:mx-auto lg:max-w-md">
            <VariableBox name="score" value={10} status="set" />
            <VariableBox name="copiedScore" value={20} previousValue={10} status="updated" />
            <div className="flex flex-col gap-1">
              <StateBadge tone="neutral">INDEPENDENT VALUES</StateBadge>
              <StateBadge tone="neutral">REASSIGNMENT</StateBadge>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          <InlineCode>copiedScore</InlineCode> received its own copy of <InlineCode>10</InlineCode>.{" "}
          <InfoTooltip label="Reassigning" code>
            Giving a variable a new value. Different from mutation, which changes an existing value in place.
          </InfoTooltip>{" "}
          it to <InlineCode>20</InlineCode> does not change <InlineCode>score</InlineCode>.
        </p>
      </div>

      {/* Stage B: sharing an array */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Now assign an array to another variable. The reference is copied, but the array itself is not
          duplicated.
        </p>
        <div className="space-y-3 rounded-lg border border-border bg-card/50 p-4">
          <BracketRow companionLabel="alias" badgeText="SAME ARRAY" badgeTone="neutral" values={[1, 2, 3]} />
          <p className="text-sm text-muted-foreground">
            <InlineCode>alias</InlineCode> did not receive a second array. It received a{" "}
            <InfoTooltip label="reference" code>
              A value JavaScript uses to point to an object or array in memory.
            </InfoTooltip>{" "}
            to the same array, so both variable names lead to one array.
          </p>
          <BracketRow
            companionLabel="alias"
            badgeText="MUTATION — SAME ARRAY CHANGED"
            badgeTone="changed"
            values={[1, 2, 3, 4]}
            revealLast
          />
          <p className="text-sm text-muted-foreground">
            <InlineCode>alias.push(4)</InlineCode> changes the array itself. Since <InlineCode>original</InlineCode>{" "}
            leads to that same array, it sees <InlineCode>4</InlineCode> too.
          </p>
        </div>
      </div>

      {/* Stage C: creating a new array */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          To add a value without touching the original array, create a new one instead.
        </p>
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <div className="space-y-3 lg:mx-auto lg:max-w-md">
            <div className="flex items-center gap-2">
              <VariableLabel>original</VariableLabel>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="space-y-1.5">
                <StateBadge tone="neutral">ORIGINAL — UNCHANGED</StateBadge>
                <ArrayVisualizer items={[1, 2, 3].map((v, i) => ({ id: `orig-${i}`, label: String(v) }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VariableLabel>updated</VariableLabel>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="space-y-1.5">
                <StateBadge tone="new">NEW ARRAY CREATED</StateBadge>
                <ArrayVisualizer
                  items={[1, 2, 3, 4].map((v, i) => ({
                    id: `new-${i}`,
                    label: String(v),
                    status: i === 3 ? "added" : "default",
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Spread reads the items from <InlineCode>original</InlineCode> and places them into a new array with{" "}
          <InlineCode>4</InlineCode>. The original array stays unchanged.
        </p>
      </div>

      {/* Compact syntax recap */}
      <div className="grid gap-3 rounded-lg border border-border bg-card/50 p-4 sm:grid-cols-3">
        <div className="space-y-1">
          <p className="font-mono text-xs">
            <InlineCode>const alias = original;</InlineCode>
          </p>
          <p className="text-xs text-muted-foreground">
            <InlineCode>alias</InlineCode> receives the reference used by <InlineCode>original</InlineCode>.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-mono text-xs">
            <InlineCode>alias.push(4);</InlineCode>
          </p>
          <p className="text-xs text-muted-foreground">
            <InlineCode>.push()</InlineCode> changes the shared array itself.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-mono text-xs">
            <InlineCode>const updated = [...original, 4];</InlineCode>
          </p>
          <p className="text-xs text-muted-foreground">
            Spread collects the existing items and <InlineCode>4</InlineCode> into a new array.
          </p>
        </div>
      </div>
    </div>
  );
}
