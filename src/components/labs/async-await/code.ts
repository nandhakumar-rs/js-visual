import type { AsyncAwaitInputs } from "./types";

// Hand-written; each scenario makes a different point about the same keyword.
// Line numbers matter — steps.ts highlights by 1-based line number.
//   top-to-bottom  8 lines → ["#501","#502"]
//   not-blocking   9 lines → start, A, end, B
//   fails         11 lines → Failed: Could not load orders
//   all-together  16 lines → script start, async1 start, async2, promise1,
//                            script end, async1 end, promise2, setTimeout
//
// The step functions are never defined in the panels: the Callbacks and
// Promises lessons already showed what getUser looks like inside, and defining
// them here would bury the shape being taught.

const TOP_TO_BOTTOM = [
  "async function load() {",
  "  const user = await getUser(1);",
  "  const orders = await getOrders(user.id);",
  "",
  "  console.log(orders);",
  "}",
  "",
  "load();",
];

const NOT_BLOCKING = [
  "async function load() {",
  '  console.log("A");',
  "  await getUser(1);",
  '  console.log("B");',
  "}",
  "",
  'console.log("start");',
  "load();",
  'console.log("end");',
];

const FAILS = [
  "async function load() {",
  "  try {",
  "    const user = await getUser(1);",
  "    const orders = await getOrders(user.id);",
  "    console.log(orders);",
  "  } catch (error) {",
  '    console.log("Failed:", error.message);',
  "  }",
  "}",
  "",
  "load();",
];

// The capstone: the ordering puzzle that combines this lesson with the Event
// Loop and Microtask Queue ones. Written the way it is usually posed, with the
// one-statement async2 body and the promise executor collapsed onto single
// lines to keep the panel a readable height — same semantics, same eight logs.
const ALL_TOGETHER = [
  'console.log("script start");',
  'setTimeout(() => console.log("setTimeout"), 0);',
  "",
  "async function async1() {",
  '  console.log("async1 start");',
  "  await async2();",
  '  console.log("async1 end");',
  "}",
  'async function async2() { console.log("async2"); }',
  "",
  "async1();",
  "",
  'new Promise((resolve) => { console.log("promise1"); resolve(); })',
  '  .then(() => console.log("promise2"));',
  "",
  'console.log("script end");',
];

export function getCode({ scenario }: AsyncAwaitInputs): string[] {
  if (scenario === "top-to-bottom") return TOP_TO_BOTTOM;
  if (scenario === "not-blocking") return NOT_BLOCKING;
  if (scenario === "fails") return FAILS;
  return ALL_TOGETHER;
}
