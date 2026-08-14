"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/lib/sound/store";
import { playCue } from "@/lib/sound/play";

export function SoundToggle() {
  const enabled = useSound((s) => s.enabled);
  const toggle = useSound((s) => s.toggle);

  function handleClick() {
    const next = !enabled;
    toggle();
    // Turning it on plays a sample immediately, so the click that enables it
    // also demonstrates it — and doubles as the user gesture the AudioContext
    // needs before it will start.
    if (next) playCue("correct");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={enabled ? "Mute sound effects" : "Unmute sound effects"}
      aria-pressed={enabled}
      onClick={handleClick}
    >
      {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
    </Button>
  );
}
