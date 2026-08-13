import type { EventLoopInputs } from "./types";

// Hand-written rather than generated: unlike the last three lessons there is no
// shared shape to vary here — each scenario is a different program making a
// different point. Line numbers matter, since steps.ts highlights by 1-based
// line number.
//   zero-timeout  7 lines  → A, C, B
//   two-timers    4 lines  → sync, first, second
//   busy-stack    8 lines  → blocking finished, timer done
//   all-together 10 lines  → start, end, timer 1, timer 2, timer 3

const ZERO_TIMEOUT = [
  'console.log("A");',
  "",
  "setTimeout(() => {",
  '  console.log("B");',
  "}, 0);",
  "",
  'console.log("C");',
];

const TWO_TIMERS = [
  'setTimeout(() => console.log("second"), 100);',
  'setTimeout(() => console.log("first"), 0);',
  "",
  'console.log("sync");',
];

const BUSY_STACK = [
  "setTimeout(() => {",
  '  console.log("timer done");',
  "}, 0);",
  "",
  "const start = Date.now();",
  "while (Date.now() - start < 800) {}",
  "",
  'console.log("blocking finished");',
];

// The capstone: everything the lesson has covered in one program, and the one
// beat none of the others show — a task registered while a task is running.
const ALL_TOGETHER = [
  'console.log("start");',
  "",
  "setTimeout(() => {",
  '  console.log("timer 1");',
  '  setTimeout(() => console.log("timer 3"), 0);',
  "}, 0);",
  "",
  'setTimeout(() => console.log("timer 2"), 0);',
  "",
  'console.log("end");',
];

export function getCode({ scenario }: EventLoopInputs): string[] {
  if (scenario === "zero-timeout") return ZERO_TIMEOUT;
  if (scenario === "two-timers") return TWO_TIMERS;
  if (scenario === "busy-stack") return BUSY_STACK;
  return ALL_TOGETHER;
}
