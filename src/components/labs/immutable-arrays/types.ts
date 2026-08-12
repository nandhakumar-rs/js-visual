export type ValuesRefMode = "share-mutate" | "copy-add";

export interface ValuesRefInputs {
  startingArray: number[];
  newValue: number;
  mode: ValuesRefMode;
}

export type ValuesRefPhase =
  | "share-create-original"
  | "share-create-alias"
  | "share-identity"
  | "share-mutate"
  | "share-after"
  | "share-log-original"
  | "share-log-alias"
  | "copy-create-original"
  | "copy-read-items"
  | "copy-add-value"
  | "copy-create-new"
  | "copy-compare"
  | "copy-log-original"
  | "copy-log-updated";

export interface ValuesRefBadge {
  text: string;
  tone: "neutral" | "changed" | "new";
}

export interface ValuesRefStepState {
  phase: ValuesRefPhase;
  /** `original`'s current contents. */
  original: number[];
  /** Highlights `original`'s items as being read (used during the copy-add "reading" step). */
  originalActive?: boolean;
  originalBadge?: ValuesRefBadge;
  /** `alias`'s (share-mutate) or `updated`'s (copy-add) current contents. Omit while not yet created. */
  companion?: number[];
  companionLabel?: "alias" | "updated";
  companionBadge?: ValuesRefBadge;
  companionEmptyHint?: string;
  /** How `original` and the companion should be drawn relative to each other. */
  connector: "shared" | "separate" | "none";
  /** Whether the last item (the newly added value) should render with "added" styling. */
  newIndexRevealed?: boolean;
}
