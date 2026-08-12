import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CallStack } from "@/components/visualizers/CallStack";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { VariableBox } from "@/components/visualizers/VariableBox";

const EXAMPLE_CODE = [
  "function multiply(a, b) {",
  "  return a * b;",
  "}",
  "",
  "function calculate() {",
  "  const subtotal = multiply(4, 5);",
  "  return subtotal + 2;",
  "}",
  "",
  "const total = calculate();",
  'console.log("total:", total);',
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        We want <InlineCode>calculate()</InlineCode> to produce <InlineCode>22</InlineCode>, but it needs{" "}
        <InlineCode>multiply()</InlineCode> to finish first.
      </p>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Three calls, waiting on each other</p>
        <div className="lg:mx-auto lg:max-w-xl">
          <CallStack
            title="Call stack at its deepest point"
            frames={[
              {
                id: "global",
                label: "Global",
                statusBadge: { text: "PAUSED — WAITING FOR calculate()", tone: "changed" },
              },
              {
                id: "calculate",
                label: "calculate()",
                statusBadge: { text: "PAUSED — WAITING FOR multiply()", tone: "changed" },
              },
              {
                id: "multiply",
                label: "multiply(4, 5)",
                isActive: true,
                statusBadge: { text: "CURRENTLY RUNNING", tone: "new" },
                variables: [
                  { name: "a", value: 4, status: "set" },
                  { name: "b", value: 5, status: "set" },
                ],
              },
            ]}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          The newest function call sits on top and runs first. When it returns, its frame leaves the stack and the
          function below it continues.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        The information for one active call is its{" "}
        <InfoTooltip label="execution context">
          The runtime state for one function call — its parameters, local variables, and where it is in the code.
        </InfoTooltip>
        . Each execution context sits on the{" "}
        <InfoTooltip label="call stack">
          The structure JavaScript uses to track which calls are active and in what order.
        </InfoTooltip>{" "}
        as its own{" "}
        <InfoTooltip label="stack frame">
          One entry on the call stack, representing a single active function call.
        </InfoTooltip>
        , in{" "}
        <InfoTooltip label="last in, first out">
          The most recently pushed frame is always the next one to be popped — nested calls always finish in the
          reverse order they started in.
        </InfoTooltip>{" "}
        order.
      </p>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Unwinding: each return hands a value back down</p>
        <div className="grid gap-3 rounded-lg border border-border bg-card/50 p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <VariableBox name="multiply()" displayValue="20" status="set" />
            <span className="text-xs text-muted-foreground">returns to calculate()</span>
          </div>
          <div className="flex items-center gap-2">
            <VariableBox name="calculate()" displayValue="22" status="set" />
            <span className="text-xs text-muted-foreground">returns to Global</span>
          </div>
          <div className="flex items-center gap-2">
            <VariableBox name="total" displayValue="22" status="set" />
            <span className="text-xs text-muted-foreground">Global receives the value</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Reading it back as code:</p>
        <CodePanel code={EXAMPLE_CODE} title="calculate()" />
        <p className="text-sm text-muted-foreground">
          Nothing here says &ldquo;wait.&rdquo; The waiting is simply what it means for{" "}
          <InlineCode>calculate()</InlineCode> to sit below <InlineCode>multiply(4, 5)</InlineCode> on the stack.
        </p>
      </div>
    </div>
  );
}
