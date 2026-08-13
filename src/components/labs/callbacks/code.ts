import type { CallbacksInputs } from "./types";

// Line numbers matter: steps.ts highlights these by fixed 1-based line number,
// so keep each array's shape in sync with the activeCodeLines values there.
// Unlike the closures lab the three scenarios share no common prefix, so each
// one owns its whole program.

const RIGHT_AWAY = [
  "function shout(name) {",
  '  return name.toUpperCase() + "!";',
  "}",
  "",
  "function greet(name, formatter) {",
  "  const text = formatter(name);",
  "  console.log(text);",
  "}",
  "",
  'greet("maya", shout);',
];

const LATER = [
  "function getUser(id, callback) {",
  "  setTimeout(() => {",
  '    callback({ id, name: "Maya" });',
  "  }, 1000);",
  "}",
  "",
  "getUser(1, (user) => {",
  "  console.log(user.name);",
  "});",
  "",
  'console.log("getUser already returned");',
];

const FAILS = [
  "function getUser(id, callback) {",
  "  setTimeout(() => {",
  "    if (id < 1) {",
  '      callback(new Error("No user " + id), null);',
  "    } else {",
  '      callback(null, { id, name: "Maya" });',
  "    }",
  "  }, 1000);",
  "}",
  "",
  "getUser(0, (error, user) => {",
  '  if (error) console.log("Failed:", error.message);',
  "  else console.log(user.name);",
  "});",
];

export function getCode({ scenario }: CallbacksInputs): string[] {
  if (scenario === "right-away") return RIGHT_AWAY;
  if (scenario === "later") return LATER;
  return FAILS;
}
