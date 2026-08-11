export type ConsoleEntryKind = "command" | "output" | "warning" | "error" | "async";

export interface ConsoleEntry {
  id: string;
  kind: ConsoleEntryKind;
  content: string;
}

export interface ExecutionStep<TState = Record<string, unknown>> {
  id: string;
  title: string;
  description: string;
  /** Falls back to `description` when omitted. Feeds the "Why did this happen?" panel. */
  whyExplanation?: string;
  activeCodeLines?: number[];
  /** Appended to the cumulative console log once this step is reached. */
  consoleOutput?: ConsoleEntry[];
  /** Lab-specific snapshot consumed by that lab's Visualization component. */
  state?: TState;
  /** Dwell time (ms) during Play/Run, before speed scaling. Defaults to 1400ms. */
  durationMs?: number;
}
