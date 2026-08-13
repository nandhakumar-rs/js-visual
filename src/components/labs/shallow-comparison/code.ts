import type { ShallowComparisonInputs } from "./types";

// Hand-written; each scenario makes a different point about the same rule.
// Line numbers matter — steps.ts highlights by 1-based line number.
//   look-alikes    6 lines → false, true
//   shallow       10 lines → true
//   nested         6 lines → true, false, false
//   all-together  11 lines → false, true, false, true, false
//
// shallowEqual is written out in full in `shallow` and referred to by name
// afterwards, so the later panels stay short enough to read at a glance.

const LOOK_ALIKES = [
  'const a = { id: 1, city: "Chennai" };',
  'const b = { id: 1, city: "Chennai" };',
  "const c = a;",
  "",
  "console.log(a === b);",
  "console.log(a === c);",
];

const SHALLOW = [
  'const a = { id: 1, city: "Chennai" };',
  'const b = { id: 1, city: "Chennai" };',
  "",
  "function shallowEqual(x, y) {",
  "  const keys = Object.keys(x);",
  "  if (keys.length !== Object.keys(y).length) return false;",
  "  return keys.every((key) => x[key] === y[key]);",
  "}",
  "",
  "console.log(shallowEqual(a, b));",
];

const NESTED = [
  'const a = { id: 1, address: { city: "Chennai" } };',
  'const b = { id: 1, address: { city: "Chennai" } };',
  "",
  "console.log(a.id === b.id);",
  "console.log(a.address === b.address);",
  "console.log(shallowEqual(a, b));",
];

// The capstone: the two places reference identity actually bites in day-to-day
// code — a lookup that cannot find a look-alike, and a spread that makes a new
// outer object while still sharing what is inside it.
const ALL_TOGETHER = [
  'const user = { id: 1, tags: ["admin"] };',
  "const users = [user];",
  "",
  'console.log(users.includes({ id: 1, tags: ["admin"] }));',
  "console.log(users.includes(user));",
  "",
  "const copy = { ...user };",
  "console.log(copy === user);",
  "console.log(copy.tags === user.tags);",
  "",
  "console.log(shallowEqual(user, { ...user, id: 2 }));",
];

export function getCode({ scenario }: ShallowComparisonInputs): string[] {
  if (scenario === "look-alikes") return LOOK_ALIKES;
  if (scenario === "shallow") return SHALLOW;
  if (scenario === "nested") return NESTED;
  return ALL_TOGETHER;
}
