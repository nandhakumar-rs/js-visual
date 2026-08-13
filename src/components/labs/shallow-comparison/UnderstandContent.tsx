import { ArrowRight } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import { StateBadge } from "@/components/visualizers/StateBadge";

const PROOF_CODE = [
  'const a = { id: 1, city: "Chennai" };',
  'const b = { id: 1, city: "Chennai" };',
  "const c = a;",
  "",
  "console.log(a === b);",
  "console.log(a === c);",
];

const ENTRIES = [
  { key: "id", displayValue: "1" },
  { key: "city", displayValue: '"Chennai"' },
];

function NameChip({ children }: { children: string }) {
  return (
    <div className="flex h-7 min-w-[3.5rem] items-center justify-center rounded-md border border-border bg-card px-2 font-mono text-xs text-muted-foreground">
      {children}
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The Values &amp; References lesson showed that a variable holds a way to <em>reach</em> an object, not
        the object itself &mdash; which is why two names can lead to one array. Comparison is where that stops
        being a curiosity: <InlineCode>===</InlineCode> asks which object, and never looks at what is inside.
      </p>

      {/* Stage A: two literals, two objects */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Two literals always make two objects</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <div className="flex items-center gap-2">
            <NameChip>a</NameChip>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1 space-y-1">
              <StateBadge tone="neutral">OBJECT #1</StateBadge>
              <ObjectVisualizer entries={ENTRIES} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NameChip>b</NameChip>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1 space-y-1">
              <StateBadge tone="neutral">OBJECT #2</StateBadge>
              <ObjectVisualizer entries={ENTRIES} />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The contents are identical, and it makes no difference. Each literal that runs creates its own
          object, with its own identity &mdash; so <InlineCode>a === b</InlineCode> is{" "}
          <InlineCode>false</InlineCode>.
        </p>
      </div>

      {/* Stage B: one object, two names */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Assigning makes a name, not an object</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <div className="flex items-stretch gap-2">
            <div className="flex flex-col justify-around gap-1.5">
              <NameChip>a</NameChip>
              <NameChip>c</NameChip>
            </div>
            <div className="flex items-stretch" aria-hidden>
              <div className="w-3 rounded-r-md border-y border-r border-muted-foreground/40" />
            </div>
            <div className="flex items-center">
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <StateBadge tone="new">OBJECT #1</StateBadge>
              <ObjectVisualizer entries={ENTRIES} isActive />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          <InlineCode>const c = a</InlineCode> copies the reference, so there is no second box &mdash; only a
          second name for the first one. Now <InlineCode>a === c</InlineCode> is{" "}
          <InlineCode>true</InlineCode>. Sharing is the only way two names compare equal.
        </p>
      </div>

      {/* Stage C: what a shallow check does instead */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">So what do you do when you meant &ldquo;same contents&rdquo;?</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="neutral">WHAT IT WALKS</StateBadge>
            <p className="text-xs text-muted-foreground">
              Every own key, once. No recursion, no prototype chain.
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="neutral">HOW IT COMPARES</StateBadge>
            <p className="text-xs text-muted-foreground">
              With <span className="font-mono">===</span> &mdash; so primitives by value, and anything else by
              identity.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          You write a{" "}
          <InfoTooltip label="shallow equality check">
            A comparison that walks both objects&apos; own keys and compares each pair of values with{" "}
            <code>===</code>. It goes one level deep and no further.
          </InfoTooltip>{" "}
          that compares the values key by key. It answers the question you actually had &mdash; as long as
          those values are primitives. The moment one of them is another object, the same identity rule
          applies one level down, and the check says they differ.
        </p>
      </div>

      {/* Stage D: the shortest proof */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">The shortest program that shows it:</p>
        <CodePanel code={PROOF_CODE} title="Same contents, different answers" activeLines={[5, 6]} />
        <p className="text-sm text-muted-foreground">
          Logs <InlineCode>false</InlineCode>, then <InlineCode>true</InlineCode> &mdash; and the pair that
          compared equal is the pair that was never two objects to begin with.
        </p>
      </div>
    </div>
  );
}
