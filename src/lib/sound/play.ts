import { useSound } from "./store";

export type Cue = "correct" | "wrong" | "lesson" | "section" | "track";

/**
 * Deliberately quiet. These are confirmations, not alarms — a learner should be
 * able to leave them on in a shared room.
 */
const MASTER_GAIN = 0.06;

/** One note: frequency in Hz, start offset and duration in seconds. */
interface Note {
  hz: number;
  at: number;
  for: number;
  type?: OscillatorType;
}

// Frequencies are named rather than magic: A4 440 tuning, one octave apart.
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const E6 = 1318.5;
const G3 = 196.0;

const CUES: Record<Cue, Note[]> = {
  // Two-note rising blip.
  correct: [
    { hz: E5, at: 0, for: 0.07 },
    { hz: G5, at: 0.06, for: 0.09 },
  ],
  // Low and soft on purpose. A wrong answer here is part of learning, so this
  // must never sound like a buzzer.
  wrong: [{ hz: G3, at: 0, for: 0.18, type: "sine" }],
  // Three-note fanfare.
  lesson: [
    { hz: C5, at: 0, for: 0.1 },
    { hz: E5, at: 0.09, for: 0.1 },
    { hz: G5, at: 0.18, for: 0.22 },
  ],
  // Longer, and resolves an octave up.
  section: [
    { hz: C5, at: 0, for: 0.1 },
    { hz: E5, at: 0.09, for: 0.1 },
    { hz: G5, at: 0.18, for: 0.1 },
    { hz: C6, at: 0.27, for: 0.14 },
    { hz: E6, at: 0.4, for: 0.3 },
  ],
  // The same shape, fuller and slower — heard at most once ever.
  track: [
    { hz: C5, at: 0, for: 0.13 },
    { hz: E5, at: 0.12, for: 0.13 },
    { hz: G5, at: 0.24, for: 0.13 },
    { hz: C6, at: 0.36, for: 0.18 },
    { hz: E6, at: 0.52, for: 0.18 },
    { hz: G5, at: 0.52, for: 0.45 },
    { hz: C6, at: 0.68, for: 0.42 },
  ],
};

type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext };

let context: AudioContext | null = null;

/**
 * Created on first play, never at module load: an AudioContext may only start
 * after a user gesture, and every cue here follows a click.
 */
function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (context) return context;

  const Ctor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext;
  if (!Ctor) return null;

  try {
    context = new Ctor();
  } catch {
    return null;
  }
  return context;
}

/**
 * Plays a cue, unless sound is off or the browser will not give us audio.
 * Always a no-op rather than a throw — a failed sound must never break an
 * answer being recorded.
 */
export function playCue(cue: Cue): void {
  if (!useSound.getState().enabled) return;

  const ctx = getContext();
  if (!ctx) return;

  try {
    // Autoplay policy can leave a context suspended until a gesture resumes it.
    if (ctx.state === "suspended") void ctx.resume();

    const start = ctx.currentTime;
    for (const note of CUES[cue]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = note.type ?? "triangle";
      osc.frequency.value = note.hz;

      // A short attack and an exponential decay: no clicks at either edge.
      const from = start + note.at;
      const to = from + note.for;
      gain.gain.setValueAtTime(0.0001, from);
      gain.gain.exponentialRampToValueAtTime(MASTER_GAIN, from + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, to);

      osc.connect(gain).connect(ctx.destination);
      osc.start(from);
      osc.stop(to + 0.02);
    }
  } catch {
    // Ignore — sound is decoration.
  }
}
