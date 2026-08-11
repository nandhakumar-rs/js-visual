"use client";

import { Check, X } from "lucide-react";
import { ObjectVisualizer } from "@/components/visualizers/ObjectVisualizer";
import type { LabVisualizationProps } from "@/types/lab";
import type { ShallowComparisonInputs, ShallowComparisonStepState } from "./types";

export function ShallowComparisonVisualization({
  step,
  inputs,
}: LabVisualizationProps<ShallowComparisonInputs, ShallowComparisonStepState>) {
  const state = step?.state ?? { checkedKeys: [] };
  const addressRefA = "Object@addr-A";
  const addressRefB = inputs.shareAddressRef ? "Object@addr-A" : "Object@addr-B";

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <ObjectVisualizer
          label="a"
          entries={[
            { key: "name", displayValue: `"${inputs.nameA}"` },
            { key: "address", displayValue: addressRefA, isReference: true },
          ]}
        />
        <ObjectVisualizer
          label="b"
          entries={[
            { key: "name", displayValue: `"${inputs.nameB}"` },
            { key: "address", displayValue: addressRefB, isReference: true },
          ]}
        />
      </div>

      <div className="space-y-1.5 text-sm">
        {state.nameMatch !== undefined && (
          <div className="flex items-center gap-1.5">
            {state.nameMatch ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-destructive" />}
            name: {String(state.nameMatch)}
          </div>
        )}
        {state.addressMatch !== undefined && (
          <div className="flex items-center gap-1.5">
            {state.addressMatch ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-destructive" />}
            address (by reference): {String(state.addressMatch)}
          </div>
        )}
      </div>
    </div>
  );
}
