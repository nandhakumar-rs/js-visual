"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import type { LabControlsProps } from "@/types/lab";
import type { AsyncTaskMode, ParallelAsyncInputs, ParallelAsyncStepState } from "./types";

const MODES: readonly AsyncTaskMode[] = ["sequential", "parallel"];

const MODE_LABEL: Record<AsyncTaskMode, string> = {
  sequential: "Sequential (await one at a time)",
  parallel: "Parallel (Promise.all)",
};

export function ParallelAsyncControls({
  inputs,
  onInputsChange,
}: LabControlsProps<ParallelAsyncInputs, ParallelAsyncStepState>) {
  return (
    <SegmentedControl
      label="Execution mode"
      size="md"
      labelAs="none"
      options={MODES}
      value={inputs.mode}
      onChange={(mode) => onInputsChange({ mode })}
      optionLabel={(mode) => MODE_LABEL[mode]}
    />
  );
}
