import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { ScopeBox } from "@/components/visualizers/ScopeBox";
import { StateBadge } from "@/components/visualizers/StateBadge";

const FACTORY_CODE = [
  "function createCounter() {",
  "  let count = 0;",
  "",
  "  return function () {",
  "    count++;",
  "    return count;",
  "  };",
  "}",
  "",
  "const counterA = createCounter();",
  "const counterB = createCounter();",
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        We want a counter that remembers its own total between calls. A global variable would work, but then every
        counter in the program would share it. What we need is a variable that belongs to one counter and to nothing
        else.
      </p>

      {/* Stage A: the variable is created by the call, inside that call's scope */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">One call creates one count</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <ScopeBox
            label="Global"
            kind="global"
            variables={[{ name: "createCounter", displayValue: "ƒ", status: "set" }]}
          >
            <ScopeBox
              label="createCounter()"
              kind="function"
              isActive
              statusBadge={{ text: "RUNNING", tone: "new" }}
              variables={[{ name: "count", displayValue: "0", status: "set" }]}
            />
          </ScopeBox>
        </div>
        <p className="text-sm text-muted-foreground">
          <InlineCode>let count = 0;</InlineCode> runs when the function is <em>called</em>, not when it is written.
          The variable belongs to this one call.
        </p>
      </div>

      {/* Stage B: the call ends and the scope survives anyway */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The call ends, but count stays</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <ScopeBox
            label="Global"
            kind="global"
            variables={[
              { name: "createCounter", displayValue: "ƒ", status: "set" },
              { name: "counterA", displayValue: "ƒ", status: "set" },
            ]}
          >
            <ScopeBox
              label="counterA's closure"
              kind="closure"
              statusBadge={{ text: "RETAINED — CALL HAS FINISHED", tone: "neutral" }}
              variables={[{ name: "count", displayValue: "0", status: "set" }]}
            />
          </ScopeBox>
        </div>
        <p className="text-sm text-muted-foreground">
          Normally a call&apos;s variables disappear when it returns. Here they cannot: the function that was
          returned still needs <InlineCode>count</InlineCode>, so the scope is kept alive for it. That pairing of a
          function and the scope it was created in is a{" "}
          <InfoTooltip label="closure">
            A function together with the variables from the scope it was created in, which it can keep using even
            after that scope&apos;s call has finished.
          </InfoTooltip>
          .
        </p>
      </div>

      {/* Stage C: per-call, not per-function */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Each call to the factory makes its own</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-xl">
          <ScopeBox
            label="counterA's closure"
            kind="closure"
            statusBadge={{ text: "INDEPENDENT", tone: "neutral" }}
            variables={[{ name: "count", displayValue: "3", status: "set" }]}
          />
          <ScopeBox
            label="counterB's closure"
            kind="closure"
            statusBadge={{ text: "INDEPENDENT", tone: "neutral" }}
            variables={[{ name: "count", displayValue: "1", status: "set" }]}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Calling <InlineCode>createCounter()</InlineCode> a second time runs{" "}
          <InlineCode>let count = 0;</InlineCode> again and creates a second variable. Three calls to{" "}
          <InlineCode>counterA()</InlineCode> leave <InlineCode>counterB</InlineCode> untouched.
        </p>
      </div>

      {/* Stage D: the other half of the deal — kept alive, and kept private */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Nothing outside can reach it</p>
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4 lg:mx-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <InlineCode>console.log(count);</InlineCode>
            <StateBadge tone="changed">PRIVATE — NOT REACHABLE</StateBadge>
          </div>
          <p className="font-mono text-xs text-destructive">Uncaught ReferenceError: count is not defined</p>
        </div>
        <p className="text-sm text-muted-foreground">
          The closure keeps <InlineCode>count</InlineCode> alive and keeps it private at the same time. The only way
          to read or change it is to call the function that was returned.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Reading it back as code:</p>
        <CodePanel code={FACTORY_CODE} title="createCounter()" />
        <p className="text-sm text-muted-foreground">
          Two calls, two closures. <InlineCode>counterA</InlineCode> and <InlineCode>counterB</InlineCode> run the
          same lines but never share a <InlineCode>count</InlineCode>.
        </p>
      </div>
    </div>
  );
}
