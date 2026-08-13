import { buildPromiseChain } from "@/lib/lessons/async-pipeline";
import type { PromisesInputs } from "./types";

// The first scenario is hand-written because it is about a single promise
// rather than a chain. The other two come from the shared generator, so they
// are the same three steps the Callback Hell lesson nested — and the failing
// step is again getOrders, so the two lessons' failure stories line up.
//   value  7 lines
//   chain  4 lines, depth 1, no catch
//   fails  5 lines, depth 1, one catch
const VALUE = [
  "const promise = getUser(1);",
  "",
  "console.log(promise);",
  "",
  "promise.then((user) => {",
  "  console.log(user.name);",
  "});",
];

const CHAIN = buildPromiseChain(3, false);
const FAILS = buildPromiseChain(3, true);

export function getCode({ scenario }: PromisesInputs): string[] {
  if (scenario === "value") return VALUE;
  if (scenario === "chain") return CHAIN;
  return FAILS;
}
