import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { IntuitionCard } from "@/components/learning/IntuitionCard";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { OperationFlow } from "@/components/visualizers/OperationFlow";
import { StateBadge, type StateBadgeTone } from "@/components/visualizers/StateBadge";
import { VariableBox, type VariableStatus } from "@/components/visualizers/VariableBox";

const EXAMPLE_CODE = ["let a;", 'let b = null;', "let c = 0;", "", "typeof a;", "typeof b;", "typeof c;"];

const CARDS = [
  { id: "a", label: "a", value: "undefined", caption: "JavaScript doesn't have a value here yet.", tone: "muted" },
  {
    id: "b",
    label: "b",
    value: "null",
    caption: "The programmer intentionally said there's no value here.",
    tone: "highlight",
  },
  { id: "c", label: "c", value: "0", caption: "This is a real value.", tone: "positive" },
] as const;

function ValueRecord({
  declaration,
  badge,
  tone,
  name,
  status,
  displayValue,
  note,
}: {
  declaration: string;
  badge: string;
  tone: StateBadgeTone;
  name: string;
  status: VariableStatus;
  displayValue: string;
  note: string;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-card/30 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <InlineCode>{declaration}</InlineCode>
        <StateBadge tone={tone}>{badge}</StateBadge>
      </div>
      <VariableBox name={name} displayValue={displayValue} status={status} size="sm" />
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Before we write any code, meet three{" "}
        <InfoTooltip label="variables">A named place where JavaScript can keep a value.</InfoTooltip> and what&apos;s
        really inside each one.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {CARDS.map((card) => (
          <IntuitionCard
            key={card.id}
            label={card.label}
            value={card.value}
            caption={card.caption}
            tone={card.tone}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">No value yet, or no value on purpose?</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ValueRecord
            declaration="let a;"
            badge="NOT ASSIGNED"
            tone="neutral"
            name="a"
            status="undefined"
            displayValue="undefined"
            note="Nobody gave a a value, so JavaScript filled the gap itself. undefined is what JavaScript uses when a value is missing."
          />
          <ValueRecord
            declaration="let b = null;"
            badge="SET DELIBERATELY"
            tone="changed"
            name="b"
            status="null"
            displayValue="null"
            note="A programmer wrote null here on purpose, to say there is no value — and to say so intentionally."
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Both look empty, but they got that way differently. <InlineCode>undefined</InlineCode> is JavaScript&apos;s
          default; <InlineCode>null</InlineCode> is a choice someone made.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">
          And <InlineCode>0</InlineCode> is neither — it&apos;s a real value
        </p>
        <div className="lg:mx-auto lg:max-w-xl">
          <ValueRecord
            declaration="let c = 0;"
            badge="REAL VALUE"
            tone="success"
            name="c"
            status="set"
            displayValue="0"
            note="0 is a number, the same way 42 is. It only looks empty because it is falsy — but falsy and empty are not the same thing."
          />
        </div>
        <p className="text-sm text-muted-foreground">
          The same is true of <InlineCode>&quot;&quot;</InlineCode> and <InlineCode>false</InlineCode>. They are
          concrete{" "}
          <InfoTooltip label="values">Concrete data JavaScript can store and use, with its own type.</InfoTooltip>, not
          stand-ins for &ldquo;no value.&rdquo;
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Asking each one its type</p>
        <div className="space-y-2 lg:mx-auto lg:max-w-xl">
          <OperationFlow label="a" input="undefined" operator="typeof" output={'"undefined"'} />
          <OperationFlow
            label="b"
            input="null"
            operator="typeof"
            output={'"object"'}
            note={{
              term: "historical quirk",
              tooltip: "Old behavior kept for compatibility, even though it looks strange today.",
            }}
          />
          <OperationFlow label="c" input="0" operator="typeof" output={'"number"'} />
        </div>
        <p className="text-sm text-muted-foreground">
          <InlineCode>a</InlineCode> and <InlineCode>c</InlineCode> answer exactly what you would expect.{" "}
          <InlineCode>b</InlineCode> does not: it reports <InlineCode>&quot;object&quot;</InlineCode> even though{" "}
          <InlineCode>null</InlineCode> is not an object. That one is a bug from 1995 that can never be fixed without
          breaking existing websites.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Reading it back as code:</p>
        <CodePanel code={EXAMPLE_CODE} title="typeof" />
        <p className="text-sm text-muted-foreground">
          In the player below you can swap <InlineCode>c</InlineCode> for any other value and watch each{" "}
          <InlineCode>typeof</InlineCode> answer change.
        </p>
      </div>
    </div>
  );
}
