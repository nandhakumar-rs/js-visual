import type { ReactNode } from "react";
import { InlineCode } from "@/components/learning/InlineCode";
import { StateBadge } from "@/components/visualizers/StateBadge";

function NumberLineChip({
  value,
  boundary,
  startLabel,
}: {
  value: number;
  boundary?: boolean;
  startLabel?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={
          boundary
            ? "flex min-w-10 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-2.5 py-1.5 font-mono text-sm text-muted-foreground"
            : "flex min-w-10 flex-col items-center justify-center rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-sm"
        }
      >
        {value}
      </div>
      {boundary ? (
        <span className="text-center text-[0.65rem] font-medium text-muted-foreground">END — NOT INCLUDED</span>
      ) : startLabel ? (
        <span className="text-center text-[0.65rem] font-medium text-muted-foreground">START — INCLUDED</span>
      ) : (
        <span aria-hidden className="text-[0.65rem]">
          &nbsp;
        </span>
      )}
    </div>
  );
}

function NumberLine({
  values,
  boundary,
  stepLabel,
}: {
  values: number[];
  boundary: number;
  stepLabel?: string;
}) {
  return (
    <div className="space-y-1.5">
      {stepLabel && <p className="text-center text-xs font-medium text-muted-foreground">{stepLabel}</p>}
      <div className="flex flex-wrap items-start justify-center gap-1.5">
        {values.map((v, i) => (
          <div key={v} className="flex items-start gap-1.5">
            <NumberLineChip value={v} startLabel={i === 0} />
            <span aria-hidden className="pt-2 text-muted-foreground">
              →
            </span>
          </div>
        ))}
        <NumberLineChip value={boundary} boundary />
      </div>
    </div>
  );
}

function ParamCard({ label, value, children }: { label: string; value: number; children: string }) {
  return (
    <div className="space-y-1 rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-xs font-medium text-muted-foreground">
        {label} — <InlineCode>{value}</InlineCode>
      </p>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function StageCard({ label, code, children }: { label: string; code: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5 rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="font-mono text-sm">{code}</p>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export function UnderstandContent() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          We want every number from <InlineCode>2</InlineCode> up to—but not including—<InlineCode>8</InlineCode>.
        </p>
        <p className="text-center font-mono text-sm">range(2, 8, 1)</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <ParamCard label="START" value={2}>
            Begin here. The start is included.
          </ParamCard>
          <ParamCard label="END" value={8}>
            Stop before this boundary. The end is excluded.
          </ParamCard>
          <ParamCard label="STEP" value={1}>
            Add this amount after each value.
          </ParamCard>
        </div>
      </div>

      <div className="space-y-2">
        <NumberLine values={[2, 3, 4, 5, 6, 7]} boundary={8} stepLabel="+1 EACH STEP" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <p className="font-mono text-sm">[2, 3, 4, 5, 6, 7]</p>
          <StateBadge tone="new">NEW ARRAY CREATED</StateBadge>
        </div>
        <p className="text-sm text-muted-foreground">
          Start at <InlineCode>2</InlineCode>. Add <InlineCode>1</InlineCode> after every value. Stop as soon as the
          next value reaches the end boundary <InlineCode>8</InlineCode>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-1.5 rounded-lg border border-border bg-card/50 p-3">
          <p className="text-center font-mono text-sm">range(2, 8, 1)</p>
          <NumberLine values={[2, 3, 4, 5, 6, 7]} boundary={8} />
          <p className="text-center font-mono text-sm">[2, 3, 4, 5, 6, 7]</p>
        </div>
        <div className="space-y-1.5 rounded-lg border border-border bg-card/50 p-3">
          <p className="text-center font-mono text-sm">range(2, 8, 2)</p>
          <NumberLine values={[2, 4, 6]} boundary={8} />
          <p className="text-center font-mono text-sm">[2, 4, 6]</p>
          <p className="text-sm text-muted-foreground">
            The step controls the distance between values. The end remains excluded even when the next jump lands
            exactly on it.
          </p>
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3">
        <p className="text-center font-mono text-sm">range(8, 2, -2)</p>
        <NumberLine values={[8, 6, 4]} boundary={2} />
        <p className="text-center font-mono text-sm">[8, 6, 4]</p>
        <p className="text-sm text-muted-foreground">
          A negative step moves downward. For descending ranges, continue while the current value is greater than the
          end boundary.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          JavaScript does not have a built-in general-purpose <InlineCode>range()</InlineCode> function, so here is a
          safe implementation, one conceptual stage at a time.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StageCard label="1. VALIDATE THE STEP" code="if (step === 0) throw ...">
            Zero would never move toward the boundary.
          </StageCard>
          <StageCard label="2. CREATE THE RESULT" code="const result = [];">
            Begin with an empty array.
          </StageCard>
          <StageCard label="3. START THE CURRENT VALUE" code="let value = start;">
            value begins at start.
          </StageCard>
          <StageCard label="4. CHECK THE BOUNDARY" code="up ? value < end : value > end">
            Use <InlineCode>{"< end"}</InlineCode> when moving up and <InlineCode>{"> end"}</InlineCode> when moving
            down.
          </StageCard>
          <StageCard label="5. COLLECT AND ADVANCE" code="result.push(value); value += step;">
            Push the current value, then add step.
          </StageCard>
          <StageCard label="6. RETURN THE ARRAY" code="return result;">
            Finish when the boundary condition becomes false.
          </StageCard>
        </div>
      </div>
    </div>
  );
}
