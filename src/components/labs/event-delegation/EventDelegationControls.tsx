"use client";

import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LabControlsProps } from "@/types/lab";
import type { DelegationMode, EventDelegationInputs, EventDelegationStepState } from "./types";

const MODES: { value: DelegationMode; label: string }[] = [
  { value: "individual", label: "Individual listeners" },
  { value: "delegation", label: "Event delegation" },
];

export function EventDelegationControls({
  inputs,
  onInputsChange,
  engine,
}: LabControlsProps<EventDelegationInputs, EventDelegationStepState>) {
  function handleClick(itemLabel: string) {
    const label = `button (${itemLabel})`;
    const path = [label, "li", "ul"];

    // Animate the bubbling path level by level so the user can watch it travel.
    path.forEach((_, i) => {
      engine.appendStep(
        {
          id: nanoid(),
          title: i === path.length - 1 ? "Listener executes" : `Event bubbles to ${path[i + 1] ?? path[i]}`,
          description:
            i === 0
              ? `The click starts at ${label}, the actual element that was clicked (event.target).`
              : i === path.length - 1
                ? inputs.mode === "delegation"
                  ? `The event reaches ul, where the single delegated listener checks event.target and runs handleClick.`
                  : `${label}'s own listener runs directly.`
                : `The event bubbles up to ${path[i]}.`,
          activeCodeLines: [],
          consoleOutput:
            i === path.length - 1
              ? [{ id: nanoid(), kind: "async", content: `handleClick fired for ${itemLabel}` }]
              : undefined,
          state: { clickedLabel: itemLabel, path, activeIndex: i },
        },
        true
      );
    });
  }

  const items = Array.from({ length: inputs.itemCount }, (_, i) => `Item ${i + 1}`);

  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Listener strategy" className="inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={inputs.mode === m.value}
            onClick={() => onInputsChange({ ...inputs, mode: m.value })}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              inputs.mode === m.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ScrollArea className="h-48 rounded-md border border-border">
        <ul className="grid grid-cols-2 gap-1 p-2 sm:grid-cols-4">
          {items.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => handleClick(label)}
                className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs transition-colors hover:border-primary hover:bg-primary/5"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
