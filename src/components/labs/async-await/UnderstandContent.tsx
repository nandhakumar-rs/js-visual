import { PauseCircle } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";

const CHAIN_CODE = [
  "getUser(1)",
  "  .then((user) => getOrders(user.id))",
  "  .then((orders) => console.log(orders));",
];

const AWAIT_CODE = [
  "const user = await getUser(1);",
  "const orders = await getOrders(user.id);",
  "console.log(orders);",
];

const PROOF_CODE = [
  "async function load() {",
  '  console.log("A");',
  "  await getUser(1);",
  '  console.log("B");',
  "}",
  "",
  'console.log("start");',
  "load();",
  'console.log("end");',
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The Promises lesson flattened the pyramid into a chain. The results, though, still only existed inside
        handlers &mdash; to use two of them together you had to nest again, or keep one in an outer variable.{" "}
        <InlineCode>async</InlineCode> and <InlineCode>await</InlineCode> remove the handlers altogether.
      </p>

      {/* Stage A: the same work, both ways */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The same work, without the handlers</p>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <StateBadge tone="neutral">PROMISE CHAIN</StateBadge>
            <CodePanel code={CHAIN_CODE} title="Handlers" />
          </div>
          <div className="min-w-0 space-y-2">
            <StateBadge tone="success">ASYNC / AWAIT</StateBadge>
            <CodePanel code={AWAIT_CODE} title="Statements" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Both wait for the same two requests, in the same order, and neither blocks. The difference is that{" "}
          <InlineCode>user</InlineCode> and <InlineCode>orders</InlineCode> are now ordinary variables in one
          scope &mdash; so an error can be caught with an ordinary <InlineCode>try</InlineCode>, and the value can
          be used anywhere below.
        </p>
      </div>

      {/* Stage B: what "pause" actually means */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">What &ldquo;pause&rdquo; actually means</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <p className="mb-2 text-sm font-semibold">Call Stack</p>
            <div className="rounded-md border border-border bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
              main()
            </div>
          </div>
          <div className="space-y-2 rounded-lg border border-dashed border-amber-500/60 bg-amber-500/5 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                <PauseCircle aria-hidden className="size-3.5 text-amber-600 dark:text-amber-400" />
                load()
              </span>
              <StateBadge tone="changed">SUSPENDED</StateBadge>
            </div>
            <p className="text-[0.7rem] text-muted-foreground">
              Waiting on <span className="font-mono">getUser(1)</span> · will continue from line{" "}
              <span className="font-mono">2</span>
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          At an <InlineCode>await</InlineCode> the function is lifted <em>off</em> the call stack and parked, with
          the line it stopped on and every variable it had bound. The stack is handed back immediately. Nothing
          is being held.
        </p>
      </div>

      {/* Stage C: who is actually paused */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">One function pauses. The thread does not.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="changed">PAUSED</StateBadge>
            <p className="text-xs text-muted-foreground">The one function that hit the await.</p>
          </div>
          <div className="space-y-1 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="success">STILL RUNNING</StateBadge>
            <p className="text-xs text-muted-foreground">
              Everything else &mdash; the rest of the script, clicks, timers, the repaint.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          When the promise settles, the rest of the function is queued as a{" "}
          <InfoTooltip label="microtask">
            The same queue from the previous lesson. Resuming after an <code>await</code> is scheduled exactly
            like a <code>.then</code> handler &mdash; because that is what it is.
          </InfoTooltip>{" "}
          rather than run on the spot. So the pause is real, but it costs the program nothing.
        </p>
      </div>

      {/* Stage D: the shortest proof */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">The shortest program that proves it:</p>
        <CodePanel code={PROOF_CODE} title="Paused, not blocked" activeLines={[3]} />
        <p className="text-sm text-muted-foreground">
          Logs <InlineCode>start</InlineCode>, <InlineCode>A</InlineCode>, <InlineCode>end</InlineCode>,{" "}
          <InlineCode>B</InlineCode>. <InlineCode>A</InlineCode> comes second because calling an async function
          runs it right away &mdash; and <InlineCode>end</InlineCode> comes before <InlineCode>B</InlineCode>{" "}
          because the thread carried on while <InlineCode>load()</InlineCode> sat waiting.
        </p>
      </div>
    </div>
  );
}
