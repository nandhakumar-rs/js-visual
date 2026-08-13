import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { TaskQueue } from "@/components/visualizers/TaskQueue";

const RULE_CODE = [
  'setTimeout(() => console.log("timeout"), 0);',
  "",
  'Promise.resolve().then(() => console.log("then"));',
  "",
  'console.log("sync");',
];

const GOES_TO_MICRO = [".then(fn)", ".catch(fn)", ".finally(fn)", "queueMicrotask(fn)"];
const GOES_TO_TASK = ["setTimeout(fn, 0)", "setInterval(fn, n)", "a click handler", "a finished fetch"];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The Event Loop lesson described one queue, and one rule: when the stack empties, take the next waiting
        task. That was a simplification. There are two queues, and one of them always goes first — which is why a{" "}
        <InlineCode>.then</InlineCode> can run before a <InlineCode>setTimeout(fn, 0)</InlineCode> that was
        scheduled earlier.
      </p>

      {/* Stage A: the two queues and what goes into each */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Two queues, not one</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="neutral">MICROTASK QUEUE</StateBadge>
            <ul className="space-y-1">
              {GOES_TO_MICRO.map((item) => (
                <li key={item} className="font-mono text-[0.7rem] text-sky-700 dark:text-sky-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="neutral">TASK QUEUE</StateBadge>
            <ul className="space-y-1">
              {GOES_TO_TASK.map((item) => (
                <li key={item} className="font-mono text-[0.7rem] text-violet-700 dark:text-violet-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Anything a promise schedules is a{" "}
          <InfoTooltip label="microtask">
            A callback queued by a promise handler or <code>queueMicrotask</code>. Microtasks wait in their own
            queue, which the event loop empties completely before it will run a single task.
          </InfoTooltip>
          . Everything the Event Loop lesson covered &mdash; timers, clicks, finished requests &mdash; is a task.
        </p>
      </div>

      {/* Stage B: the priority rule */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Microtasks are checked first</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <TaskQueue title="Microtask Queue" items={[{ id: "a", label: "then handler" }]} variant="micro" />
          <TaskQueue title="Task Queue" items={[{ id: "b", label: "timeout callback" }]} variant="macro" />
        </div>
        <p className="text-sm text-muted-foreground">
          When the stack empties, the loop does not simply take the oldest waiting callback. It looks at the
          microtask queue first, every time. While anything is waiting there, the task queue is not consulted at
          all.
        </p>
      </div>

      {/* Stage C: exhaustive, and re-entrant */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The whole queue drains, not one per turn</p>
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4 lg:mx-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Microtasks empty?</span>
            <StateBadge tone="changed">NO</StateBadge>
            <span className="text-xs text-muted-foreground">&mdash; run the next one, then ask again</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Microtasks empty?</span>
            <StateBadge tone="success">YES</StateBadge>
            <span className="text-xs text-muted-foreground">&mdash; only now take one task</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The loop keeps going until the queue is genuinely empty &mdash; and a microtask added <em>during</em>{" "}
          the drain joins the same pass. A chain of ten <InlineCode>.then</InlineCode> handlers all runs before a
          timer that was ready before any of them.
        </p>
      </div>

      {/* Stage D: and it repeats */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">And that happens after every task</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-border bg-card/50 p-4 font-mono text-xs">
            <span className="rounded border border-violet-500/40 bg-violet-500/10 px-2 py-1 text-violet-700 dark:text-violet-400">
              task
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-400">
              drain all microtasks
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="rounded border border-violet-500/40 bg-violet-500/10 px-2 py-1 text-violet-700 dark:text-violet-400">
              task
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-400">
              drain all microtasks
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The drain is not a one-off before the first task. Two tasks never run back to back if either queues a
          microtask &mdash; the loop empties the microtask queue between them. This is also where the browser
          gets its chance to repaint.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">The shortest program that shows it:</p>
        <CodePanel code={RULE_CODE} title="Scheduled first, runs last" activeLines={[1]} />
        <p className="text-sm text-muted-foreground">
          Logs <InlineCode>sync</InlineCode>, then <InlineCode>then</InlineCode>, then{" "}
          <InlineCode>timeout</InlineCode> &mdash; even though the timer was scheduled two lines earlier and asked
          for no delay at all.
        </p>
      </div>
    </div>
  );
}
