import { ArrowDown } from "lucide-react";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";

// Matches defaultInputs.users in ./index.tsx — this content is static
// (like null-vs-undefined's Experience cards), so keep the two in sync by
// hand if the default users ever change.
const USERS = [
  { id: "u1", name: "Alex", age: 20 },
  { id: "u2", name: "Maya", age: 22 },
  { id: "u3", name: "John", age: 19 },
];

export function UnderstandContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">We have three users.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {USERS.map((u) => (
            <div key={u.id} className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {u.name[0]}
              </div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.age} years old</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          We only want everyone&apos;s name. For each user, we take the name and put it into a new list.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {USERS.map((u) => (
            <div key={u.id} className="flex flex-col items-center gap-1.5">
              <div className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                {u.name}, {u.age}
              </div>
              <ArrowDown className="size-3.5 text-muted-foreground" aria-hidden />
              <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                {u.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Put those three names together and we get a brand new list:</p>
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
          {USERS.map((u) => (
            <span key={u.id} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {u.name}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          In JavaScript, this exact pattern — take an array,{" "}
          <InfoTooltip label="transform">
            Turn a value into a new, different value — like turning a full user into just their name.
          </InfoTooltip>{" "}
          every item the same way, and collect the results — has a name: <InlineCode>.map()</InlineCode>.
        </p>
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="mb-3 text-center font-mono text-sm">
            <InlineCode>users</InlineCode>.map(<InlineCode>user</InlineCode> {"=>"} <InlineCode>user.name</InlineCode>)
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            <p>
              <InfoTooltip label="array">
                An ordered list of values that JavaScript can store and loop through together.
              </InfoTooltip>{" "}
              this array
            </p>
            <p>
              <InfoTooltip label="current item">
                The single element .map() is looking at right now, one at a time, in order.
              </InfoTooltip>{" "}
              current item
            </p>
            <p>what this item should become</p>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <InlineCode>user.name</InlineCode> is the value we get back for this user — its{" "}
            <InfoTooltip label="return value">
              Whatever a function hands back as its result — here, whatever you return for each user
              becomes its entry in the new array.
            </InfoTooltip>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
