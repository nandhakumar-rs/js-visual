import { ArrowRight, Check, X } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";

const PROOF_CODE = [
  "const cache = new Map();",
  "",
  "function priceFor(qty) {",
  "  if (cache.has(qty)) return cache.get(qty);",
  "",
  "  const result = qty * 50; // pretend this is slow",
  "  cache.set(qty, result);",
  "  return result;",
  "}",
];

const KEYS = [
  { kind: "A number or string", verdict: "Straightforward — equal values are the same key." },
  { kind: "An object", verdict: "Only the very same object matches. A look-alike does not." },
  { kind: "Several arguments", verdict: "They have to be combined into one key somehow." },
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Two lessons ago you learned what it means for two values to be &ldquo;the same&rdquo;. One lesson
        ago, what checking that costs. This is what the answer is for: if you can recognise a question you
        have already answered, you never have to answer it twice.
      </p>

      {/* Stage A: the same question, asked twice */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The same question, answered twice</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          {["priceFor(2)", "priceFor(2)"].map((call, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2"
            >
              <span className="font-mono text-xs">{call}</span>
              <ArrowRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">the slow work runs</span>
              <StateBadge tone="changed" className="ml-auto">
                100
              </StateBadge>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          The second call cannot produce a different answer &mdash; it has the same input and the function
          does not depend on anything else. Doing the work again is pure waste.
        </p>
      </div>

      {/* Stage B: hit and miss */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">So write the answer down, and look first</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="changed">
              <X aria-hidden className="mr-0.5 inline size-3" />
              MISS
            </StateBadge>
            <p className="text-xs text-muted-foreground">
              Not in the cache. Do the work, store it under the key, return it.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="success">
              <Check aria-hidden className="mr-0.5 inline size-3" />
              HIT
            </StateBadge>
            <p className="text-xs text-muted-foreground">
              Already there. Return the stored value and skip the work entirely.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          That is the whole of{" "}
          <InfoTooltip label="memoization">
            Caching a function&apos;s results by its arguments, so a repeated call returns the stored answer
            instead of recomputing it.
          </InfoTooltip>
          . It trades memory for time: one stored row per distinct input, one calculation saved per repeat.
        </p>
      </div>

      {/* Stage C: the one hard question */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Which leaves one hard question: what is the key?</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          {KEYS.map((k) => (
            <div
              key={k.kind}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-border bg-card/50 px-3 py-2"
            >
              <span className="text-sm font-medium">{k.kind}</span>
              <span className="text-xs text-muted-foreground">{k.verdict}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          &ldquo;Have I been asked this before?&rdquo; is an equality question, so everything from the last
          two lessons decides the answer. A <InlineCode>Map</InlineCode> compares its keys by identity, so
          an object argument only hits for a caller holding that exact object &mdash; and comparing contents
          instead is the O(n) walk you just wrote, which may cost more than the work you are trying to skip.
        </p>
      </div>

      {/* Stage D: the shortest version */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">The whole pattern, in one function:</p>
        <CodePanel code={PROOF_CODE} title="Look first, work second" activeLines={[4]} />
        <p className="text-sm text-muted-foreground">
          One line does the remembering. Everything interesting about memoization &mdash; whether it helps,
          whether it is even correct &mdash; is decided by what goes in that line.
        </p>
      </div>
    </div>
  );
}
