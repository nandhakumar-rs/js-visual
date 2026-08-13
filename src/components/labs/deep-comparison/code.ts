import type { DeepComparisonInputs } from "./types";

// Hand-written; each scenario makes a different point about the same walk.
// Line numbers matter — steps.ts highlights by 1-based line number.
//   shallow-vs-deep  5 lines → false, true
//   walk            12 lines → true            (4 comparisons)
//   mismatch         5 lines → false, false    (4 and 2 comparisons)
//   all-together    11 lines → true, false, true, false, then a TypeError
//
// deepEqual is written out in full in `walk` and referred to by name in the
// other tabs, so those panels stay short enough to read at a glance.
// shallowEqual is the helper from the previous lesson, unchanged.

const SHALLOW_VS_DEEP = [
  'const a = { name: "Maya", address: { city: "Chennai" } };',
  'const b = { name: "Maya", address: { city: "Chennai" } };',
  "",
  "console.log(shallowEqual(a, b));",
  "console.log(deepEqual(a, b));",
];

const WALK = [
  "function deepEqual(x, y) {",
  "  if (x === y) return true;",
  '  if (typeof x !== "object" || typeof y !== "object") return false;',
  "  if (x === null || y === null) return false;",
  "",
  "  const keys = Object.keys(x);",
  "  if (keys.length !== Object.keys(y).length) return false;",
  "",
  "  return keys.every((key) => deepEqual(x[key], y[key]));",
  "}",
  "",
  "console.log(deepEqual(a, b));",
];

const MISMATCH = [
  'const a = { name: "Maya", address: { city: "Chennai" } };',
  'const b = { name: "Maya", address: { city: "Bangalore" } };',
  "",
  "console.log(deepEqual(a, b));",
  "console.log(deepEqual(a.address, b.address));",
];

// The capstone: the four-line version almost everyone writes from memory, run
// against the inputs that expose what it left out. Every result here was
// observed, including the throw on the last line.
const ALL_TOGETHER = [
  "function deepEqual(x, y) {",
  "  if (x === y) return true;",
  '  if (typeof x !== "object" || typeof y !== "object") return false;',
  "  return Object.keys(x).every((key) => deepEqual(x[key], y[key]));",
  "}",
  "",
  "console.log(deepEqual({ id: 1 }, { id: 1, extra: 2 }));",
  "console.log(deepEqual({ id: 1, extra: 2 }, { id: 1 }));",
  "console.log(deepEqual([1, 2], { 0: 1, 1: 2 }));",
  "console.log(deepEqual({ n: NaN }, { n: NaN }));",
  "console.log(deepEqual(null, { id: 1 }));",
];

export function getCode({ scenario }: DeepComparisonInputs): string[] {
  if (scenario === "shallow-vs-deep") return SHALLOW_VS_DEEP;
  if (scenario === "walk") return WALK;
  if (scenario === "mismatch") return MISMATCH;
  return ALL_TOGETHER;
}
