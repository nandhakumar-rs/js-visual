import { ArrowRight } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { ScopeBox } from "@/components/visualizers/ScopeBox";
import { StateBadge } from "@/components/visualizers/StateBadge";

const EXAMPLE_CODE = [
  'const appName = "Visualize JS";',
  "",
  "function greetUser() {",
  '  const userName = "Maya";',
  "",
  "  if (userName) {",
  "    const message = `Welcome, ${userName}`;",
  "    console.log(message, appName);",
  "  }",
  "}",
  "",
  "greetUser();",
];

function LookupTrail({
  variable,
  steps,
  found,
}: {
  variable: string;
  steps: string[];
  found: string;
}) {
  return (
    <div className="space-y-1.5 rounded-lg border border-border/60 bg-card/30 p-3">
      <InlineCode>{variable}</InlineCode>
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {steps.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ArrowRight aria-hidden className="size-3" />}
            {s}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <StateBadge tone="success">FOUND</StateBadge>
        <span className="text-xs">{found}</span>
      </div>
    </div>
  );
}

function BlockedTrail({ description }: { description: string }) {
  return (
    <div className="space-y-1.5 rounded-lg border border-border/60 bg-card/30 p-3">
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>cannot look inward</span>
      </div>
      <StateBadge tone="error">NOT ACCESSIBLE</StateBadge>
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Our program creates values in different places. We need to understand which parts of the program are
        allowed to use each value.
      </p>

      <div className="lg:mx-auto lg:max-w-xl">
        <ScopeBox
          label="Global Scope"
          kind="global"
          variables={[{ name: "appName", displayValue: '"Visualize JS"', status: "set" }]}
        >
          <ScopeBox
            label="Function Scope — greetUser()"
            kind="function"
            variables={[{ name: "userName", displayValue: '"Maya"', status: "set" }]}
          >
            <ScopeBox
              label="Block Scope — if"
              kind="block"
              variables={[{ name: "message", displayValue: '"Welcome, Maya"', status: "set" }]}
            />
          </ScopeBox>
        </ScopeBox>
      </div>

      <p className="text-sm text-muted-foreground">
        Each inner scope can see the values declared in the scopes around it, but the outer scopes can&apos;t see
        inside the inner ones. This is <InfoTooltip label="lexical scope">Variable accessibility determined by where code is physically written, not by how or when a function is called.</InfoTooltip>.
      </p>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Reading from inside the block</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <LookupTrail
            variable="message"
            steps={["current scope"]}
            found="Found immediately in the current block."
          />
          <LookupTrail
            variable="userName"
            steps={["not in the block", "look outward"]}
            found="Not in the block — found in the enclosing function."
          />
          <LookupTrail
            variable="appName"
            steps={["not in the block", "not in the function", "look outward"]}
            found="Not in the block or function — found in the global scope."
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Outer code can&apos;t look inward</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <BlockedTrail description={"Global code trying to read userName"} />
          <BlockedTrail description={"Function code outside the block trying to read message"} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Reading it back as code:
        </p>
        <CodePanel code={EXAMPLE_CODE} title="greetUser()" />
        <p className="text-sm text-muted-foreground">
          <InlineCode>appName</InlineCode> &rarr; global, <InlineCode>userName</InlineCode> &rarr; function,{" "}
          <InlineCode>message</InlineCode> &rarr; block — matching the nested boxes above, and reachable in that
          order by the{" "}
          <InfoTooltip label="scope chain">The chain of enclosing scopes JavaScript walks through, from the current scope out to the global scope, when resolving an identifier.</InfoTooltip>.
        </p>
      </div>
    </div>
  );
}
