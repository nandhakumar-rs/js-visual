"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LabControlsProps } from "@/types/lab";
import type { RetryInputs, RetryStepState } from "./types";

export function RetryControls({ inputs, onInputsChange }: LabControlsProps<RetryInputs, RetryStepState>) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-56 space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="failures-before">Failures before success</Label>
          <span className="tabular-nums text-muted-foreground">{inputs.failuresBeforeSuccess}</span>
        </div>
        <Slider
          id="failures-before"
          min={0}
          max={5}
          step={1}
          value={[inputs.failuresBeforeSuccess]}
          onValueChange={(vals) =>
            onInputsChange({ ...inputs, failuresBeforeSuccess: Array.isArray(vals) ? vals[0] : vals })
          }
        />
      </div>
      <div className="w-56 space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="max-retries">Max retries</Label>
          <span className="tabular-nums text-muted-foreground">{inputs.maxRetries}</span>
        </div>
        <Slider
          id="max-retries"
          min={1}
          max={5}
          step={1}
          value={[inputs.maxRetries]}
          onValueChange={(vals) => onInputsChange({ ...inputs, maxRetries: Array.isArray(vals) ? vals[0] : vals })}
        />
      </div>
      <div className="w-32 space-y-1">
        <Label htmlFor="retry-delay">Retry delay</Label>
        <Select
          value={String(inputs.retryDelayMs)}
          onValueChange={(v) => onInputsChange({ ...inputs, retryDelayMs: Number(v) })}
        >
          <SelectTrigger id="retry-delay">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500">500ms</SelectItem>
            <SelectItem value="1000">1000ms</SelectItem>
            <SelectItem value="2000">2000ms</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="exp-backoff"
          checked={inputs.exponentialBackoff}
          onCheckedChange={(checked) => onInputsChange({ ...inputs, exponentialBackoff: checked })}
        />
        <Label htmlFor="exp-backoff">Exponential backoff</Label>
      </div>
    </div>
  );
}
