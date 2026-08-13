import type { PromiseState } from "@/components/visualizers/PromiseNode";

/** The three walkthroughs the scenario picker offers. */
export type ScenarioId = "value" | "chain" | "fails";

export interface PromisesInputs {
  scenario: ScenarioId;
}

/**
 * The repeating unit of a chain. It cycles once per link, which is why the
 * phase strip loops rather than advancing linearly — a chain is the same three
 * beats over and over, with no extra indentation for any of them.
 */
export type PromisePhase = "pending" | "settling" | "handler-runs" | "done" | "rejected";

export type LinkStatus = "waiting" | "pending" | "fulfilled" | "rejected" | "skipped" | "caught";

export interface ChainLink {
  id: string;
  /** The handler as written, e.g. ".then((user) => getOrders(user.id))". */
  label: string;
  status: LinkStatus;
  /** State of the promise this link produced. Fed straight to PromiseNode. */
  promiseState?: PromiseState;
  /** The settled value or rejection reason, shown on the node. */
  value?: string;
  isCatch?: boolean;
}

export interface PromisesStepState {
  phase: PromisePhase;
  /** Ordered head-first. Rendered as a flat list — the flatness is the argument. */
  links: ChainLink[];
  /** Set once a rejection is travelling down the chain, looking for a .catch. */
  rejectionInFlight?: string;
  /** One-line aside rendered under the chain. */
  note?: string;
}
