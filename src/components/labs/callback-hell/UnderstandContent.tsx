import { ArrowRight } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";
import { buildNested } from "@/lib/lessons/async-pipeline";

const ONE_STEP_DEFINITION = [
  "function getOrders(userId, callback) {",
  "  setTimeout(() => {",
  "    callback([{ id: 77 }]);",
  "  }, 1000);",
  "}",
];

const THREE_STEPS = buildNested(3, false);

const CHAIN = [
  { fn: "getUser", needs: "an id", gives: "user" },
  { fn: "getOrders", needs: "user.id", gives: "orders" },
  { fn: "getItems", needs: "orders[0].id", gives: "items" },
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Real work is usually a sequence: fetch the user, then their orders, then the items in the first order.
        Each step needs what the step before it produced. With callbacks, writing that sequence has a shape you
        do not get to choose — and the shape gets worse with every step you add.
      </p>

      {/* Stage A: the data dependency that drives everything else */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Each step needs the one before it</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          {CHAIN.map((link) => (
            <div
              key={link.fn}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/50 p-3"
            >
              <span className="font-mono text-xs font-semibold">{link.fn}</span>
              <span className="text-xs text-muted-foreground">needs</span>
              <InlineCode>{link.needs}</InlineCode>
              <ArrowRight aria-hidden className="size-3 text-muted-foreground" />
              <VariableBox name="gives" displayValue={link.gives} status="set" size="sm" />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Each of these is an ordinary callback-style function, exactly like the previous lesson&apos;s{" "}
          <InlineCode>getUser</InlineCode>:
        </p>
        <CodePanel code={ONE_STEP_DEFINITION} title="getOrders()" />
      </div>

      {/* Stage B: why the nesting is forced rather than chosen */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">So the next call has to go inside the callback</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold">getUser(1, ...)</span>
              <StateBadge tone="success">user LIVES IN HERE</StateBadge>
            </div>
            <div className="border-t border-border/60 pt-3">
              <div className="rounded-lg border border-border bg-card/50 p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold">getOrders(user.id, ...)</span>
                  <StateBadge tone="neutral">LEVEL 2</StateBadge>
                </div>
                <p className="text-xs text-muted-foreground">
                  The only place <InlineCode>user.id</InlineCode> can be read.
                </p>
              </div>
            </div>
          </div>
          <p className="font-mono text-xs text-destructive">
            outside the callback: ReferenceError: user is not defined
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          The result is handed to you as an <em>argument</em>, so it exists inside that function and nowhere
          else. Anything that needs it has to be written in there too. Repeat for every step and you get{" "}
          <InfoTooltip label="callback hell">
            Sequencing dependent async steps by nesting each callback inside the previous one, which drives the
            code steadily rightwards and repeats the error handling at every level.
          </InfoTooltip>
          .
        </p>
      </div>

      {/* Stage C: the shape that results */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Every level drifts further right</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <CodePanel code={THREE_STEPS} title="Three steps" activeLines={[5, 6, 7]} />
        </div>
        <p className="text-sm text-muted-foreground">
          Three steps, three levels, and three closing <InlineCode>{"});"}</InlineCode> lines whose only job is to
          shut what was opened. The single line that does real work sits deepest of all. Add a fourth step and
          everything below it shifts right again.
        </p>
      </div>

      {/* Stage D: the cost that named functions do not fix */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">And every level needs its own error check</p>
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4 lg:mx-auto lg:max-w-xl">
          {["level 1", "level 2", "level 3"].map((level) => (
            <div key={level} className="flex flex-wrap items-center gap-2">
              <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{level}</span>
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.75rem] text-foreground">
                if (error) return console.log(&quot;Failed:&quot;, error.message);
              </code>
            </div>
          ))}
          <StateBadge tone="changed">THE SAME LINE, THREE TIMES</StateBadge>
        </div>
        <p className="text-sm text-muted-foreground">
          An error handed to one level is invisible to every other level, so there is nowhere shared to put the
          handling. The <InlineCode>return</InlineCode> stops only the callback it is written in — there is no
          outer handler for it to fall back to.
        </p>
      </div>
    </div>
  );
}
