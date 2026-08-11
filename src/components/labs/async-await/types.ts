export type AsyncStyle = "promises" | "async-await";

export interface AsyncAwaitInputs {
  statusesFail: boolean;
  style: AsyncStyle;
}

// Reuses the exact same visualization shape as the Promise.all lab —
// async/await changes only the code representation, not the underlying
// asynchronous behavior being visualized.
export type { PromiseAllStepState as AsyncAwaitStepState } from "../promise-all/types";
