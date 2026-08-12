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
  /** Classic layout only — guided labs configure entirely through `simulationControls` instead. */
  Controls?: ComponentType<LabControlsProps<TInputs, TState>>;
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
  /**
   * Guided layout only. Renders always-visible, above the code/visualization
   * split, for controls that configure what the walkthrough demonstrates
   * (e.g. picking an operation or a value). Available from the start — the
   * guided layout has no gated "try it yourself" step; the player itself is
   * the experiment surface.
   */
  simulationControls?: ComponentType<LabControlsProps<TInputs, TState>>;
  /**
   * Guided layout only. A full-width panel rendered below the whole
   * code/visualization row (and below the console and why panel), for a
   * self-contained comparison experiment that sits alongside the step player
   * rather than inside it. Takes no props on purpose: an experiment must not
   * be able to move the player's step or inputs.
   */
  experimentPanel?: ComponentType;
  /**
   * Set false to hide the console panel entirely, for lessons that are fully
   * visualized without needing a console.log-style transcript. Defaults to
   * true (shown) when omitted. Only affects the guided-layout branch.
   */
  showConsole?: boolean;
  /**
   * Set false to hide the separate "Why did this happen?" card in the player
   * area, for lessons whose per-step description (shown in the step
   * controller) already stands alone without a second, near-duplicate
   * explanation. Defaults to true (shown) when omitted. Guided layout only.
   */
  showWhyPanel?: boolean;
}

// Registry entries are heterogeneous in their TInputs/TState, so they're
// stored type-erased and each lab module fully owns its own types internally.
export type AnyLabDefinition = LabDefinition<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
