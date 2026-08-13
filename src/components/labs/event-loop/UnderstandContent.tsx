import { ArrowDown } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CallStack } from "@/components/visualizers/CallStack";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { TaskQueue } from "@/components/visualizers/TaskQueue";

const ZERO_TIMEOUT = [
  'console.log("A");',
  "",
  "setTimeout(() => {",
  '  console.log("B");',
  "}, 0);",
  "",
  'console.log("C");',
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The Callbacks lesson left a question open: when you hand a function to <InlineCode>setTimeout</InlineCode>
        , where does it wait, and what decides the exact moment it runs? The answer is three places and one rule
        — and it explains why a delay of <InlineCode>0</InlineCode> never means &ldquo;now&rdquo;.
      </p>

      {/* Stage A: the constraint everything else follows from */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">One stack, one thing at a time</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <CallStack
            frames={[
              { id: "main", label: "main()", isActive: true, statusBadge: { text: "RUNNING", tone: "new" } },
            ]}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          JavaScript is single-threaded: there is one call stack, and whatever sits on it is the only thing
          running. Nothing can interrupt it. So any work that has to wait cannot simply sit on the stack waiting
          — it would block everything else.
        </p>
      </div>

      {/* Stage B: where the waiting actually happens */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The waiting happens somewhere else</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold">setTimeout(fn, 1000)</span>
              <StateBadge tone="success">RETURNS IMMEDIATELY</StateBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              Registers <InlineCode>fn</InlineCode> with the browser and hands control straight back.
            </p>
          </div>
          <div className="flex justify-center">
            <ArrowDown aria-hidden className="size-4 text-muted-foreground" />
          </div>
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">Web APIs</span>
              <StateBadge tone="neutral">OFF THE STACK</StateBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              The browser counts down the second here, while your code carries on.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The timer is not part of the JavaScript engine. It belongs to a{" "}
          <InfoTooltip label="Web API">
            Functionality the browser provides alongside the JavaScript engine — timers, network requests, the
            DOM. The waiting happens here, outside the single thread your code runs on.
          </InfoTooltip>
          , which is why <InlineCode>setTimeout</InlineCode> can return instantly and still fire later.
        </p>
      </div>

      {/* Stage C: the queue, not the stack */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Finished work waits in a queue</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <TaskQueue title="Task Queue" items={[{ id: "cb", label: '() => console.log("B")' }]} variant="macro" />
        </div>
        <p className="text-sm text-muted-foreground">
          When the timer ends, the browser does <em>not</em> run your callback. It cannot — the stack might be
          busy. So it puts the callback in the task queue, where it waits its turn. The same queue receives
          clicks and finished network requests.
        </p>
      </div>

      {/* Stage D: the rule that decides everything */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The loop moves it only when the stack is empty</p>
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4 lg:mx-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Stack empty?</span>
            <StateBadge tone="changed">NO</StateBadge>
            <span className="text-xs text-muted-foreground">&mdash; the queued task waits</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Stack empty?</span>
            <StateBadge tone="success">YES</StateBadge>
            <span className="text-xs text-muted-foreground">&mdash; take the first task and run it</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          That check is the{" "}
          <InfoTooltip label="event loop">
            The runtime&apos;s scheduler. It repeatedly checks whether the call stack is empty, and if it is,
            moves the first waiting task from the queue onto the stack to run.
          </InfoTooltip>
          . It is the only thing that decides when your callback runs — and it will not act while any of your own
          code is still on the stack.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Putting it together:</p>
        <CodePanel code={ZERO_TIMEOUT} title="A delay of 0" activeLines={[3, 4, 5]} />
        <p className="text-sm text-muted-foreground">
          <InlineCode>B</InlineCode> is scheduled before <InlineCode>C</InlineCode> is even reached, and asks for
          no delay at all &mdash; yet it prints last. It has to go to the browser, into the queue, and wait for
          the stack to clear before it can run.
        </p>
      </div>
    </div>
  );
}
