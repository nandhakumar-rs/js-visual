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
