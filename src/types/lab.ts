import type { ComponentType } from "react";
import type { ExecutionEngine } from "@/lib/execution/useExecutionEngine";
import type { ExecutionStep } from "@/lib/execution/types";
import type {
  ChallengeConfig,
  ExperienceConfig,
  ExplainSummaryConfig,
  PredictionConfig,
} from "@/components/learning/types";

export interface LabControlsProps<TInputs, TState = Record<string, unknown>> {
  inputs: TInputs;
  onInputsChange: (next: TInputs) => void;
  engine: ExecutionEngine<TState>;
}

export interface LabVisualizationProps<TInputs, TState = Record<string, unknown>> {
  step: ExecutionStep<TState> | undefined;
  inputs: TInputs;
  engine: ExecutionEngine<TState>;
}

export interface LabDefinition<TInputs = unknown, TState = Record<string, unknown>> {
  slug: string;
  /**
   * 'scripted'    — LabRuntime recomputes steps from buildInitialSteps(inputs)
   *                 whenever inputs change (e.g. Hoisting: var/let/const/function).
   * 'interactive' — steps are pushed live via engine.appendStep() in response to
   *                 real user events (e.g. Closures' "Create Counter" button,
   *                 Debounce's keystrokes). buildInitialSteps seeds step 0 only.
   */
  mode: "scripted" | "interactive";
  defaultInputs: TInputs;
  getCode: (inputs: TInputs) => string[];
  buildInitialSteps: (inputs: TInputs) => ExecutionStep<TState>[];
  Controls: ComponentType<LabControlsProps<TInputs, TState>>;
  Visualization: ComponentType<LabVisualizationProps<TInputs, TState>>;
  prediction?: PredictionConfig;
  challenge: ChallengeConfig;
  remember: string;

  /**
   * Omit (or "classic") to render via LessonShell exactly as today. "guided"
   * renders via GuidedLessonShell's phase-ordered layout (Understand → Watch
   * it work → Why? → Test yourself → Challenge) — only opt in when
   * experience/explainSummary are also supplied.
   */
  layout?: "classic" | "guided";
  experience?: ExperienceConfig;
  explainSummary?: ExplainSummaryConfig;
  /** Short prompt shown above the inline "Try it yourself" experiment controls. */
  experimentPrompt?: string;
  /**
   * Set false to hide the console panel entirely, for lessons that are fully
   * visualized without needing a console.log-style transcript. Defaults to
   * true (shown) when omitted. Only affects the guided-layout branch.
   */
  showConsole?: boolean;
}

// Registry entries are heterogeneous in their TInputs/TState, so they're
// stored type-erased and each lab module fully owns its own types internally.
export type AnyLabDefinition = LabDefinition<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
