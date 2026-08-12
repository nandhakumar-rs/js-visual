import { ArrowDown } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import { VariableBox, type VariableStatus } from "@/components/visualizers/VariableBox";

const SCOPE_CODE = [
  "function startCourse() {",
  '  var status = "Ready";',
  '  let learner = "Maya";',
  '  const course = "JavaScript";',
  "",
  "  function startLesson() {",
  '    console.log("Lesson started");',
  "  }",
  "}",
];

const PHASES = ["Enter the scope", "Prepare declarations", "Run statements"];

const DECLARATIONS: {
  declaration: string;
  badge: string;
  tone: StateBadgeTone;
  name: string;
  value: string;
  status: VariableStatus;
  note: string;
}[] = [
  {
    declaration: "var status",
    badge: "AVAILABLE — undefined",
    tone: "neutral",
    name: "status",
    value: "undefined",
    status: "undefined",
    note: "The binding is initialized with undefined. Reading it before the declaration line is allowed.",
  },
  {
    declaration: "let learner",
    badge: "UNINITIALIZED — CANNOT READ",
    tone: "changed",
    name: "learner",
    value: "<uninitialized>",
    status: "tdz",
    note: "The binding exists, but it cannot be read until the declaration executes.",
  },
  {
    declaration: "const course",
    badge: "UNINITIALIZED — CANNOT READ",
    tone: "changed",
    name: "course",
    value: "<uninitialized>",
    status: "tdz",
    note: "Like let, the binding exists but cannot be read before its declaration executes.",
  },
  {
    declaration: "function startLesson()",
    badge: "FUNCTION READY — CALLABLE",
    tone: "success",
    name: "startLesson",
    value: "ƒ startLesson()",
    status: "set",
    note: "The binding is initialized with the function, so it can already be called.",
  },
];

function DeclarationRecord({ item }: { item: (typeof DECLARATIONS)[number] }) {
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-card/30 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <InlineCode>{item.declaration}</InlineCode>
        <StateBadge tone={item.tone}>{item.badge}</StateBadge>
      </div>
      <VariableBox name={item.name} displayValue={item.value} status={item.status} size="sm" />
      <p className="text-xs text-muted-foreground">{item.note}</p>
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        When JavaScript enters a scope, it first prepares the declarations it finds. Variables may still need their
        declaration line to initialize or assign a value, while function declarations are prepared with their function
        already available. Most confusion about &ldquo;hoisting&rdquo; comes from treating every declaration as if it
        were prepared the same way.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:items-start">
        <ol className="space-y-1.5" aria-label="Scope setup phases">
          {PHASES.map((phase, index) => (
            <li key={phase} className="space-y-1.5">
              {/* mx-auto keeps each connector centered under the box above it. */}
              {index > 0 && <ArrowDown aria-hidden className="mx-auto size-3.5 text-muted-foreground" />}
              <div className="rounded-md border border-border bg-card/40 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide">
                {phase}
              </div>
            </li>
          ))}
        </ol>

        <div className="space-y-3">
          <CodePanel code={SCOPE_CODE} title="startCourse()" />
          <p className="text-sm text-muted-foreground">
            When this scope is entered, JavaScript finds all four declarations before running a single statement.
            Each one is prepared differently.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">After &ldquo;prepare declarations&rdquo;, before any statement runs</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {DECLARATIONS.map((item) => (
            <DeclarationRecord key={item.declaration} item={item} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          The period before a <InlineCode>let</InlineCode> or <InlineCode>const</InlineCode> binding is initialized is
          called the{" "}
          <InfoTooltip label="Temporal Dead Zone">
            The window in which a binding exists but has no value yet. It starts when the scope is entered and ends
            when the declaration is evaluated. Reading the binding during that window throws a ReferenceError.
          </InfoTooltip>
          , or <strong>TDZ</strong>.
        </p>
        <p className="text-sm text-muted-foreground">
          &ldquo;Hoisting&rdquo; describes declarations being prepared before statement execution. JavaScript does not
          physically move the code.
        </p>
      </div>
    </div>
  );
}
