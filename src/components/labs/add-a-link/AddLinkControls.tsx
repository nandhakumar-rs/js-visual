"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabControlsProps } from "@/types/lab";
import type { AddLinkInputs, AddLinkStepState } from "./types";

export function AddLinkControls({ inputs, onInputsChange }: LabControlsProps<AddLinkInputs, AddLinkStepState>) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-1">
        <Label htmlFor="link-href">href</Label>
        <Input
          id="link-href"
          value={inputs.href}
          onChange={(e) => onInputsChange({ ...inputs, href: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="link-text">Link text</Label>
        <Input
          id="link-text"
          value={inputs.text}
          onChange={(e) => onInputsChange({ ...inputs, text: e.target.value })}
        />
      </div>
    </div>
  );
}
