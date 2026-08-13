import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { PromiseNode } from "@/components/visualizers/PromiseNode";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { buildNested, buildPromiseChain } from "@/lib/lessons/async-pipeline";

const PYRAMID = buildNested(3, false);
const CHAIN = buildPromiseChain(3, false);

const PROMISIFIED = [
  "function getUser(id) {",
  "  return new Promise((resolve, reject) => {",
  "    getUserCb(id, (error, user) => {",
  "      if (error) reject(error);",
  "      else resolve(user);",
  "    });",
  "  });",
  "}",
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The last lesson ended with a complaint: dependent steps nest, every level repeats the same error check,
        and the code drifts rightwards. All three come from one root cause — the result was only ever reachable
        inside a callback. A promise fixes that by making the result something you can hold.
      </p>

      {/* Stage A: the result becomes an ordinary value */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">A promise is a value you can hold</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="changed">CALLBACK</StateBadge>
            <p className="font-mono text-xs text-muted-foreground">getUser(1, (user) =&gt; …);</p>
            <p className="text-xs text-muted-foreground">
              Hands back nothing. The user exists only inside the callback.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="success">PROMISE</StateBadge>
            <p className="font-mono text-xs text-muted-foreground">const p = getUser(1);</p>
            <PromiseNode label="p" state="pending" />
            <p className="text-xs text-muted-foreground">
              A real value. Name it, return it from a function, pass it on.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          A{" "}
          <InfoTooltip label="promise">
            An object standing in for a result that has not arrived yet. It starts pending and later settles —
            once, permanently — either fulfilled with a value or rejected with a reason.
          </InfoTooltip>{" "}
          is returned immediately, long before the work is done.
        </p>
      </div>

      {/* Stage B: the state machine, and the guarantee it buys */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">It settles once, to one of two outcomes</p>
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4 lg:mx-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <PromiseNode state="pending" />
            <span className="text-xs text-muted-foreground">becomes one of</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PromiseNode state="fulfilled" value='{ id: 1, name: "Maya" }' />
            <PromiseNode state="rejected" value="Error: No orders" />
          </div>
          <p className="font-mono text-[0.7rem] text-muted-foreground">
            resolve(&quot;first&quot;); resolve(&quot;second&quot;); &nbsp;&rarr;&nbsp; stays
            &quot;first&quot;
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          One transition, and it is permanent. The Callbacks lesson noted that nothing stops a callback being
          called twice, or never — a promise settling exactly once is a guarantee you get for free. A handler
          attached <em>after</em> it settles still receives the value.
        </p>
      </div>

      {/* Stage C: the payoff the previous lesson promised */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">.then returns a new promise, so they chain</p>
        <div className="grid gap-3 lg:mx-auto lg:max-w-xl">
          <CodePanel code={PYRAMID} title="Callbacks — 7 lines, 3 levels" />
          <CodePanel code={CHAIN} title="Promises — 4 lines, 1 level" />
        </div>
        <p className="text-sm text-muted-foreground">
          The same three steps. Because <InlineCode>.then</InlineCode> hands back <em>another promise</em>, the
          next <InlineCode>.then</InlineCode> attaches to that one instead of nesting inside it. Returning{" "}
          <InlineCode>getOrders(user.id)</InlineCode> from a handler makes the chain wait for it, which is how
          each step still feeds the next.
        </p>
      </div>

      {/* Stage D: where promises come from in the first place */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Where the promise comes from</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <CodePanel code={PROMISIFIED} title="Wrapping a callback API" activeLines={[4, 5]} />
        </div>
        <p className="text-sm text-muted-foreground">
          Underneath, something still has to settle it. <InlineCode>new Promise</InlineCode> hands you{" "}
          <InlineCode>resolve</InlineCode> and <InlineCode>reject</InlineCode>; calling either one settles the
          promise, and whichever runs first wins. Wrapping an old callback-style function this way is called
          promisifying it.
        </p>
      </div>
    </div>
  );
}
