import { Check, CornerDownRight, Minus, X } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";

const PROOF_CODE = [
  'const a = { name: "Maya", address: { city: "Chennai" } };',
  'const b = { name: "Maya", address: { city: "Chennai" } };',
  "",
  "console.log(shallowEqual(a, b));",
  "console.log(deepEqual(a, b));",
];

const RULES = [
  { rule: "Same value?", then: "Answer true. Nothing left to check." },
  { rule: "Either one not an object?", then: "Answer false. === already settled it." },
  { rule: "Otherwise?", then: "Ask the same question again, about each key." },
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The last lesson ended on an unfinished answer: a shallow check reported two objects with identical
        data as different, because one of their values was itself an object. That is not a bug to work
        around &mdash; it is a check that stops one level down. This lesson is what happens when it does not
        stop.
      </p>

      {/* Stage A: the unfinished pair, as a tree */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The pair is deeper than it looks</p>
        <div className="space-y-1 lg:mx-auto lg:max-w-xl">
          <div className="rounded-md border border-border/60 bg-card/20 px-2.5 py-1.5">
            <p className="font-mono text-[0.7rem] text-muted-foreground">(root)</p>
            <p className="font-mono text-xs">
              {"{ … }"} <span className="text-muted-foreground">===</span> {"{ … }"}
            </p>
          </div>
          <div className="ml-4 rounded-md border border-emerald-500/40 bg-emerald-500/5 px-2.5 py-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CornerDownRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
              <span className="font-mono text-[0.7rem] text-muted-foreground">name</span>
              <StateBadge tone="success" className="ml-auto">
                <Check aria-hidden className="mr-0.5 inline size-3" />
                MATCH
              </StateBadge>
            </div>
            <p className="font-mono text-xs">
              &quot;Maya&quot; <span className="text-emerald-600 dark:text-emerald-400">===</span>{" "}
              &quot;Maya&quot;
            </p>
          </div>
          <div className="ml-4 rounded-md border border-destructive/40 bg-destructive/5 px-2.5 py-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CornerDownRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
              <span className="font-mono text-[0.7rem] text-muted-foreground">address</span>
              <StateBadge tone="error" className="ml-auto">
                <X aria-hidden className="mr-0.5 inline size-3" />
                DIFFERENT
              </StateBadge>
            </div>
            <p className="font-mono text-xs">
              {"{ … }"} <span className="text-destructive">!==</span> {"{ … }"}
            </p>
          </div>
          <div className="ml-8 rounded-md border border-dashed border-border/60 bg-card/10 px-2.5 py-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CornerDownRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
              <span className="font-mono text-[0.7rem] text-muted-foreground">address.city</span>
              <StateBadge tone="neutral" className="ml-auto">
                <Minus aria-hidden className="mr-0.5 inline size-3" />
                NEVER VISITED
              </StateBadge>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              &quot;Chennai&quot; &nbsp;?&nbsp; &quot;Chennai&quot;
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Four pairs of values, not two. The shallow check answered at the second one and never read the
          fourth &mdash; which is the only place the two objects could have been told apart.
        </p>
      </div>

      {/* Stage B: what "deep" adds */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">A deep check adds exactly one rule</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          {RULES.map(({ rule, then }, i) => (
            <div
              key={rule}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-card/50 px-3 py-2"
            >
              <span className="font-mono text-[0.65rem] text-muted-foreground">{i + 1}</span>
              <span className="text-sm font-medium">{rule}</span>
              <span className="text-xs text-muted-foreground">{then}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          The first two rules are what a shallow check already does. The third is the whole difference: on
          finding two objects it does not answer, it{" "}
          <InfoTooltip label="recurses">
            Calls itself with a smaller pair of values. The call stack keeps track of where it was, so the
            function only ever has to handle one pair at a time.
          </InfoTooltip>{" "}
          &mdash; and the same three rules apply again, one level down.
        </p>
      </div>

      {/* Stage C: what that costs */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Which means one call per value in the tree</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="neutral">WHEN THEY MATCH</StateBadge>
            <p className="text-xs text-muted-foreground">
              Every node is visited exactly once. Four values, four calls.
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="neutral">WHEN THEY DIFFER</StateBadge>
            <p className="text-xs text-muted-foreground">
              It stops at the first difference &mdash; which may be the first node or the last.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          So the cost is linear in the total number of values, not in the number of keys at the top. That is
          the second half of the interview question, and the experiment below measures it.
        </p>
      </div>

      {/* Stage D: the shortest proof */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">The shortest program that shows both answers:</p>
        <CodePanel code={PROOF_CODE} title="Same pair, two questions" activeLines={[4, 5]} />
        <p className="text-sm text-muted-foreground">
          Logs <InlineCode>false</InlineCode>, then <InlineCode>true</InlineCode>. Neither is wrong &mdash;
          they are answers to different questions about the same two objects.
        </p>
      </div>
    </div>
  );
}
