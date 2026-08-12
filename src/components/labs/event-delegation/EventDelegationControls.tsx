"use client";

import { nanoid } from "nanoid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { DelegationMode, EventDelegationInputs, EventDelegationStepState } from "./types";

const MODES: readonly DelegationMode[] = ["individual", "delegation"];

const MODE_LABEL: Record<DelegationMode, string> = {
  individual: "Individual listeners",
  delegation: "Event delegation",
};

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
      <SegmentedControl
        label="Listener strategy"
        size="md"
        labelAs="none"
        options={MODES}
        value={inputs.mode}
        onChange={(mode) => onInputsChange({ ...inputs, mode })}
        optionLabel={(mode) => MODE_LABEL[mode]}
      />

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
