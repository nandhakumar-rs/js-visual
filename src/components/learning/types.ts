import type { ReactNode } from "react";

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface PredictionConfig {
  /**
   * Extra question text shown above the code, in addition to "What do you
   * think happens?" (PredictionCard's title). Omit for the common case where
   * the code snippet alone is self-explanatory.
   */
  prompt?: string;
  code?: string[];
  options: ChoiceOption[];
  correctOptionId: string;
  /** Shown after the user answers, alongside the actual result. */
  explanation: string;
}

export interface ChallengeConfig {
  question: string;
  code?: string[];
  options: ChoiceOption[];
  correctOptionId: string;
  explanation: string;
}

export type IntuitionCardTone = "muted" | "highlight" | "positive";

export interface IntuitionCardData {
  id: string;
  label: string;
  value: string;
  caption: string;
  tone?: IntuitionCardTone;
}

/** The "Experience" phase of a guided lesson: plain-language intro before any code. */
export interface ExperienceConfig {
  prompt?: ReactNode;
  cards?: IntuitionCardData[];
  /**
   * Rich custom composition for the Understand phase, rendered instead of
   * the cards grid when present. Use for lessons whose pre-code intro needs
   * more than the label/value/caption card shape (e.g. a multi-beat
   * narrative with several visual moments).
   */
  content?: ReactNode;
}

/** The "Why?" phase of a guided lesson: a short, compact bullet-point summary. */
export interface ExplainSummaryConfig {
  title?: string;
  bullets: ReactNode[];
  /** Always-shown highlighted callout below the bullets, e.g. a language quirk. */
  quirkNote?: ReactNode;
  /** Extra depth shown only in Technical explanation mode — deepens, doesn't duplicate. */
  technicalNote?: ReactNode;
}
