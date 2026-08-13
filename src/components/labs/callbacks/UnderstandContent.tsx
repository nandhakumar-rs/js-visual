import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge } from "@/components/visualizers/StateBadge";
import { VariableBox } from "@/components/visualizers/VariableBox";

const GET_USER_CODE = [
  "function getUser(id, callback) {",
  "  setTimeout(() => {",
  '    callback({ id, name: "Maya" });',
  "  }, 1000);",
  "}",
  "",
  "getUser(1, (user) => {",
  "  console.log(user.name);",
  "});",
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Some work does not finish on the line that starts it — reading a file, loading a user, waiting a second.
        The function you called has to return before the answer exists. So how does the answer ever reach you?
        The oldest answer in JavaScript is to give that function a function of your own, for it to call when it is
        ready.
      </p>

      {/* Stage A: the passing-vs-calling distinction the whole lesson rests on */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">A function is a value you can hand over</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/50 p-3">
            <VariableBox name="shout" displayValue="ƒ" status="set" size="sm" />
            <span className="text-xs text-muted-foreground">
              a value, like a number or a string — it can be stored, or passed to something else
            </span>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <InlineCode>greet(&quot;maya&quot;, shout)</InlineCode>
              <StateBadge tone="success">HANDED OVER, UNCALLED</StateBadge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <InlineCode>greet(&quot;maya&quot;, shout())</InlineCode>
              <StateBadge tone="error">CALLED FIRST</StateBadge>
            </div>
            <p className="font-mono text-xs text-destructive">
              TypeError: Cannot read properties of undefined (reading &apos;toUpperCase&apos;)
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The parentheses are the whole difference. <InlineCode>shout</InlineCode> is the function itself;{" "}
          <InlineCode>shout()</InlineCode> runs it right now — with no name to work on — and hands over whatever
          came back.
        </p>
      </div>

      {/* Stage B: the receiver owns the timing, and even the name */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Whoever receives it decides when to call it</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">greet()</span>
              <StateBadge tone="neutral">HOLDING YOUR FUNCTION</StateBadge>
            </div>
            <VariableBox name="formatter" displayValue="ƒ" status="set" size="sm" />
            <p className="mt-2 text-xs text-muted-foreground">
              The same function, under the name greet() chose for it.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          A function handed over this way is a{" "}
          <InfoTooltip label="callback">
            A function you pass to another function, so that it can be called later — when, and whether, is up to
            the function you gave it to.
          </InfoTooltip>
          . Nothing in the language marks it as one: <InlineCode>callback</InlineCode> is just a parameter name,
          and the receiver could call it once, three times, or never.
        </p>
      </div>

      {/* Stage C: the reason callbacks exist at all */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">When the work finishes later, there is nothing to return</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="error">RETURN VALUE</StateBadge>
            <p className="font-mono text-xs text-muted-foreground">const user = getUser(1);</p>
            <VariableBox name="user" displayValue="undefined" status="undefined" size="sm" />
            <p className="text-xs text-muted-foreground">
              getUser had to return before the answer existed, so it returned nothing.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
            <StateBadge tone="success">CALLBACK</StateBadge>
            <p className="font-mono text-xs text-muted-foreground">getUser(1, (user) =&gt; …);</p>
            <VariableBox name="user" displayValue='{ id: 1, name: "Maya" }' status="set" size="sm" />
            <p className="text-xs text-muted-foreground">
              getUser kept your function and called it once the answer existed.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The answer arrives as an <em>argument</em> to your own function, rather than as the return value of the
          one you called.
        </p>
      </div>

      {/* Stage D: the convention that lets failures use the same route */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Errors come back the same way</p>
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4 lg:mx-auto lg:max-w-xl">
          <p className="font-mono text-xs text-muted-foreground">(error, user) =&gt; …</p>
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge tone="success">IT WORKED</StateBadge>
            <VariableBox name="error" displayValue="null" status="null" size="sm" />
            <VariableBox name="user" displayValue='{ id: 1, name: "Maya" }' status="set" size="sm" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge tone="error">IT FAILED</StateBadge>
            <VariableBox name="error" displayValue="Error: No user 0" status="error" size="sm" />
            <VariableBox name="user" displayValue="null" status="null" size="sm" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          By convention the error goes in the first slot, so every callback can start by asking whether it was
          handed a problem. The error is <em>passed</em>, never thrown — which is why{" "}
          <InlineCode>try</InlineCode>/<InlineCode>catch</InlineCode> around the call would not catch it.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Reading it back as code:</p>
        <CodePanel code={GET_USER_CODE} title="getUser()" />
        <p className="text-sm text-muted-foreground">
          The call on lines 7 to 9 finishes immediately, having logged nothing. A second later{" "}
          <InlineCode>getUser</InlineCode> calls the function you gave it, and only then does{" "}
          <InlineCode>Maya</InlineCode> appear.
        </p>
      </div>
    </div>
  );
}
