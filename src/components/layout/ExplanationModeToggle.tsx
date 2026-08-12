"use client";

import { SegmentedControl } from "@/components/learning/SegmentedControl";
import { useExplanationMode, type ExplanationMode } from "@/lib/ui-state/explanation-mode-store";

const MODES: readonly ExplanationMode[] = ["simple", "technical"];

const MODE_LABEL: Record<ExplanationMode, string> = {
  simple: "Concept",
  technical: "Technical",
};

export function ExplanationModeToggle() {
  const mode = useExplanationMode((s) => s.mode);
  const setMode = useExplanationMode((s) => s.setMode);

  return (
    <SegmentedControl
      label="Explanation detail level"
      labelAs="none"
      options={MODES}
      value={mode}
      onChange={setMode}
      optionLabel={(option) => MODE_LABEL[option]}
    />
  );
}
