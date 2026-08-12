import type { VariableStatus } from "@/components/visualizers/VariableBox";

// The main walkthrough is a fixed narrative — nothing about it is
// user-configurable, unlike labs such as Execution Context (a/b/bonus).
export type ScopeInputs = Record<string, never>;

export type ScopeId = "global" | "function" | "block";

export interface ScopeVarEntry {
  name: string;
  displayValue: string;
  status: VariableStatus;
}

export interface ScopeLookup {
  variable: string;
  /** Scopes searched, in order, starting at the current scope and moving outward. */
  path: ScopeId[];
  foundIn: ScopeId;
}

export interface ScopeStepState {
  currentScope: ScopeId;
  functionOpen: boolean;
  blockOpen: boolean;
  globalVars: ScopeVarEntry[];
  functionVars: ScopeVarEntry[];
  blockVars: ScopeVarEntry[];
  lookups?: ScopeLookup[];
}
