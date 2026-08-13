import { buildNested } from "@/lib/lessons/async-pipeline";
import type { CallbackHellInputs } from "./types";

// Generated from the shared pipeline rather than hand-written, so the line
// numbers steps.ts highlights stay correct by construction. Resulting shapes:
//   two-steps   5 lines, depth 2, no error checks
//   four-steps  9 lines, depth 4, no error checks
//   fails      10 lines, depth 3, three identical error checks
const TWO_STEPS = buildNested(2, false);
const FOUR_STEPS = buildNested(4, false);
const FAILS = buildNested(3, true);

export function getCode({ scenario }: CallbackHellInputs): string[] {
  if (scenario === "two-steps") return TWO_STEPS;
  if (scenario === "four-steps") return FOUR_STEPS;
  return FAILS;
}
