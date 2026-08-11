import type { ReactNode } from "react";
import { Ban } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { StateBadge } from "@/components/visualizers/StateBadge";

const USERS = ["Alex", "Maya", "John", "Priya"];

function UserCard({ name }: { name: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="mx-auto mb-1.5 flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {name[0]}
      </div>
      <p className="text-sm font-medium">{name}</p>
    </div>
  );
}

function TermRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,auto)_1fr] items-baseline gap-x-3 gap-y-0.5">
      <InlineCode>{term}</InlineCode>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function Stage({
  label,
  highlight,
  dashed,
  children,
}: {
  label: string;
  highlight?: boolean;
  dashed?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        highlight
          ? "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-center"
          : dashed
            ? "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/20 p-3 text-center text-muted-foreground"
            : "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center"
      }
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 py-1 lg:flex-col lg:gap-1.5 lg:py-0">
      <span className="rotate-90 text-muted-foreground lg:rotate-0" aria-hidden="true">
        →
      </span>
      <span className="text-center text-xs text-muted-foreground lg:max-w-[6.5rem]">{label}</span>
    </div>
  );
}

function StopConnector() {
  return (
    <div className="flex flex-row items-center justify-center gap-2 py-1 lg:flex-col lg:gap-1 lg:py-0">
      <Ban className="size-4 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" aria-hidden="true" />
      <span className="text-center text-xs font-semibold text-muted-foreground">STOP SEARCHING</span>
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">We have a list of users.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {USERS.map((name) => (
            <UserCard key={name} name={name} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">We want to know: Is Maya in this list?</p>

        <div className="flex flex-col items-center gap-1.5">
          <div className="inline-flex flex-col items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2">
            <p className="text-xs font-medium text-muted-foreground">LOOKING FOR</p>
            <p className="font-mono text-sm font-semibold">Maya</p>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span aria-hidden="true">↓</span>
            <span className="text-xs">Check each user against this name</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">JavaScript checks the users, one at a time, left to right.</p>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          <Stage label="ALEX">
            <InlineCode>&quot;Alex&quot; === &quot;Maya&quot;</InlineCode>
            <StateBadge tone="neutral">CHECKED — NO MATCH</StateBadge>
          </Stage>

          <FlowArrow label="keep looking" />

          <Stage label="MAYA" highlight>
            <InlineCode>&quot;Maya&quot; === &quot;Maya&quot;</InlineCode>
            <StateBadge tone="new">MATCH FOUND</StateBadge>
          </Stage>

          <StopConnector />

          <Stage label="JOHN, PRIYA" dashed>
            <p className="text-xs">not checked</p>
            <StateBadge tone="neutral">NOT CHECKED</StateBadge>
          </Stage>

          <FlowArrow label="answer is known" />

          <Stage label="RESULT" highlight>
            <p className="font-mono text-sm font-semibold text-foreground">true</p>
            <InfoTooltip label="Boolean">
              A Boolean is a value that can only be <InlineCode>true</InlineCode> or <InlineCode>false</InlineCode>.
            </InfoTooltip>
          </Stage>
        </div>

        <p className="text-sm text-muted-foreground">
          Once JavaScript finds one match, it already knows the answer is <InlineCode>true</InlineCode>. It does
          not need to check the remaining users.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          We only need a yes-or-no answer, so JavaScript gives us <InlineCode>some()</InlineCode>.
        </p>
        <p className="rounded-lg border border-border bg-card/50 p-3 text-center font-mono text-sm">
          const exists = users.some(user =&gt; user.name === &quot;Maya&quot;);
        </p>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4">
        <p className="text-xs font-medium text-muted-foreground">HOW TO READ THIS</p>
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <TermRow term="users">search this array</TermRow>
          <TermRow term=".some(...)">ask the same yes/no question for each user</TermRow>
          <TermRow term="user">the user currently being checked</TermRow>
          <TermRow term='user.name === "Maya"'>the question asked for that user</TermRow>
          <TermRow term="exists">
            receives <InlineCode>true</InlineCode> or <InlineCode>false</InlineCode>
          </TermRow>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <InlineCode>some()</InlineCode> returns <InlineCode>true</InlineCode> as soon as one user matches. If
        nobody matches, it returns <InlineCode>false</InlineCode>.
      </p>
    </div>
  );
}
