import type { MemoizationInputs } from "./types";

// Hand-written; each scenario makes a different point about the same cache.
// Line numbers matter — steps.ts highlights by 1-based line number.
//   hit-and-miss   13 lines → 100, 150, 100          (2 calculations)
//   the-key        15 lines → 100, 100, 100          (2 calculations, 2 entries)
//   when-it-hurts  19 lines → 1000, 50, 50           (0 hits, then a stale answer)
//   all-together   18 lines → 1 keys, 1 keys, 2 keys, 2 keys   (3 calculations)

const HIT_AND_MISS = [
  "const cache = new Map();",
  "",
  "function priceFor(qty) {",
  "  if (cache.has(qty)) return cache.get(qty);",
  "",
  "  const result = qty * 50; // pretend this is slow",
  "  cache.set(qty, result);",
  "  return result;",
  "}",
  "",
  "console.log(priceFor(2));",
  "console.log(priceFor(3));",
  "console.log(priceFor(2));",
];

const THE_KEY = [
  "const cache = new Map();",
  "",
  "function totalFor(order) {",
  "  if (cache.has(order)) return cache.get(order);",
  "",
  "  const result = order.qty * order.price;",
  "  cache.set(order, result);",
  "  return result;",
  "}",
  "",
  "const order = { qty: 2, price: 50 };",
  "",
  "console.log(totalFor(order));",
  "console.log(totalFor(order));",
  "console.log(totalFor({ qty: 2, price: 50 }));",
];

const WHEN_IT_HURTS = [
  "// priceFor and cache are the memoized pair from the first tab",
  "for (let i = 0; i < 1000; i++) priceFor(i);",
  "",
  "console.log(cache.size);",
  "",
  "let rate = 10;",
  "const rateCache = new Map();",
  "",
  "function convert(amount) {",
  "  if (rateCache.has(amount)) return rateCache.get(amount);",
  "",
  "  const result = amount * rate;",
  "  rateCache.set(amount, result);",
  "  return result;",
  "}",
  "",
  "console.log(convert(5));",
  "rate = 20;",
  "console.log(convert(5));",
];

// The capstone: the reusable wrapper, and the one line that decides whether it
// is correct. Both of this key's failure modes are on show — a collision that
// returns a wrong answer, and a split that recalculates identical data.
const ALL_TOGETHER = [
  "function memoize(fn) {",
  "  const cache = new Map();",
  "  return (...args) => {",
  "    const key = JSON.stringify(args);",
  "    if (cache.has(key)) return cache.get(key);",
  "",
  "    const result = fn(...args);",
  "    cache.set(key, result);",
  "    return result;",
  "  };",
  "}",
  "",
  'const describe = memoize((o) => Object.keys(o).length + " keys");',
  "",
  "console.log(describe({ a: undefined }));",
  "console.log(describe({}));",
  "console.log(describe({ x: 1, y: 2 }));",
  "console.log(describe({ y: 2, x: 1 }));",
];

export function getCode({ scenario }: MemoizationInputs): string[] {
  if (scenario === "hit-and-miss") return HIT_AND_MISS;
  if (scenario === "the-key") return THE_KEY;
  if (scenario === "when-it-hurts") return WHEN_IT_HURTS;
  return ALL_TOGETHER;
}
