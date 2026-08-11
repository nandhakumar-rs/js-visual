"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { EngineSpeed, EngineStatus } from "@/lib/execution/useExecutionEngine";

export interface StepControlsProps {
  currentIndex: number;
  totalSteps: number;
  status: EngineStatus;
  speed: EngineSpeed;
  onNext: () => void;
  onPrevious: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: EngineSpeed) => void;
  className?: string;
}

export function StepControls({
  currentIndex,
  totalSteps,
  status,
  speed,
  onNext,
  onPrevious,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  className,
}: StepControlsProps) {
  const isPlaying = status === "playing";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="default"
        size="sm"
        onClick={isPlaying ? onPause : onPlay}
        disabled={totalSteps === 0}
        className="gap-1.5"
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        {isPlaying ? "Pause" : "Run"}
      </Button>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onPrevious}
          disabled={currentIndex <= 0}
          aria-label="Previous step"
        >
          <SkipBack className="size-4" />
        </Button>
        <span className="min-w-[5.5rem] text-center text-xs text-muted-foreground tabular-nums">
          Step {totalSteps === 0 ? 0 : currentIndex + 1} of {totalSteps}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onNext}
          disabled={currentIndex >= totalSteps - 1}
          aria-label="Next step"
        >
          <SkipForward className="size-4" />
        </Button>
      </div>

      <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
        <RotateCcw className="size-4" />
        Reset
      </Button>

      <Select value={String(speed)} onValueChange={(v) => onSpeedChange(Number(v) as EngineSpeed)}>
        <SelectTrigger size="sm" className="ml-auto w-20" aria-label="Playback speed">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0.5">0.5x</SelectItem>
          <SelectItem value="1">1x</SelectItem>
          <SelectItem value="2">2x</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
