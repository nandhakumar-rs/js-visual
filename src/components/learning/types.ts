import type { ReactNode } from "react";

export interface ChoiceOption {
  id: string;
  label: string;
  /**
   * Teaching feedback specific to *this* option, shown after the learner
   * answers, above the question's shared `explanation`. Use it when each
   * wrong answer has its own distinct misconception worth naming. Omit for
   * questions where the single shared explanation already covers every case.
   */
  feedback?: string;
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
  /** Always-shown extra depth below the bullets — deepens, doesn't duplicate. Not gated by the Concept/Technical toggle. */
  technicalNote?: ReactNode;
  /**
   * Compact comparison list, rendered distinctly from the bullet list (e.g.
   * comparing a few named approaches). Each item is either a simple
   * label + description (rendered as a 3-across card grid), or — when every
   * item supplies `columns` — a compact responsive table with one row per
   * item and a header row built from the first item's column headers.
   */
  comparisonItems?: {
    label: string;
    description?: ReactNode;
    /** Up to ~3 short columns. When present, comparisonItems renders as a table instead of a card grid. */
    columns?: { header: string; value: ReactNode }[];
  }[];
  /** Header text for the comparisonItems table's first (label) column. Defaults to "Method". */
  columnsHeader?: string;
}
