import type { MicrotaskInputs } from "./types";

// Hand-written; each scenario makes a different point about the same rule.
// Line numbers matter — steps.ts highlights by 1-based line number.
//   rule          5 lines  → sync, then, timeout
//   drain         8 lines  → sync, m1, m2, m3, timeout
//   between       9 lines  → t1, m1, t2, m2
//   all-together 14 lines  → start, end, promise 1, promise 2, timer,
//                            promise inside timer, timer inside promise

const RULE = [
  'setTimeout(() => console.log("timeout"), 0);',
  "",
  'Promise.resolve().then(() => console.log("then"));',
  "",
  'console.log("sync");',
];

const DRAIN = [
  'setTimeout(() => console.log("timeout"), 0);',
  "",
  "Promise.resolve()",
  '  .then(() => console.log("m1"))',
  '  .then(() => console.log("m2"))',
  '  .then(() => console.log("m3"));',
  "",
  'console.log("sync");',
];

const BETWEEN = [
  "setTimeout(() => {",
  '  console.log("t1");',
  '  Promise.resolve().then(() => console.log("m1"));',
  "}, 0);",
  "",
  "setTimeout(() => {",
  '  console.log("t2");',
  '  Promise.resolve().then(() => console.log("m2"));',
  "}, 0);",
];

// The capstone: both queues, nesting in both directions, and every rule the
// lesson has covered in one program. The inner one-statement handlers are
// written on a single line to keep the panel readable — the semantics and the
// seven logged strings are unchanged.
const ALL_TOGETHER = [
  'console.log("start");',
  "",
  "setTimeout(() => {",
  '  console.log("timer");',
  '  Promise.resolve().then(() => console.log("promise inside timer"));',
  "}, 0);",
  "",
  "Promise.resolve().then(() => {",
  '  console.log("promise 1");',
  '  setTimeout(() => console.log("timer inside promise"), 0);',
  '  Promise.resolve().then(() => console.log("promise 2"));',
  "});",
  "",
  'console.log("end");',
];

export function getCode({ scenario }: MicrotaskInputs): string[] {
  if (scenario === "rule") return RULE;
  if (scenario === "drain") return DRAIN;
  if (scenario === "between") return BETWEEN;
  return ALL_TOGETHER;
}
