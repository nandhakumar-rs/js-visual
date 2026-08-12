import type { ScopeId } from "./types";

export type ScopeLocation = ScopeId;
export type ScopeVariableName = "appName" | "userName" | "message";

const SCOPE_ORDER: ScopeLocation[] = ["global", "function", "block"];

const HOME: Record<ScopeVariableName, ScopeLocation> = {
  appName: "global",
  userName: "function",
  message: "block",
};

const VALUES: Record<ScopeVariableName, string> = {
  appName: '"JS Visual Lab"',
  userName: '"Maya"',
  message: '"Welcome, Maya"',
};

export const SCOPE_LOCATION_LABEL: Record<ScopeLocation, string> = {
  global: "Global",
  function: "Inside greetUser()",
  block: "Inside the if block",
};

export interface LookupResult {
  accessible: boolean;
  /** Scopes JavaScript actually searches, in order, starting at the current location. */
  searchPath: ScopeLocation[];
  foundIn: ScopeLocation | null;
  value: string | null;
}

/**
 * Deterministic scope-chain walk: search starts at `location` and moves
 * outward (block -> function -> global). A variable is only reachable if
 * its declaring scope is the current scope or an enclosing one — JavaScript
 * never searches inward, so a home scope nested deeper than `location` is
 * never found, no matter how far outward the search continues.
 */
export function lookupVariable(location: ScopeLocation, variable: ScopeVariableName): LookupResult {
  const locationIndex = SCOPE_ORDER.indexOf(location);
  const homeIndex = SCOPE_ORDER.indexOf(HOME[variable]);
  const accessible = homeIndex <= locationIndex;
  const walkToIndex = accessible ? homeIndex : 0;

  const searchPath: ScopeLocation[] = [];
  for (let i = locationIndex; i >= walkToIndex; i--) {
    searchPath.push(SCOPE_ORDER[i]);
  }

  return {
    accessible,
    searchPath,
    foundIn: accessible ? HOME[variable] : null,
    value: accessible ? VALUES[variable] : null,
  };
}
