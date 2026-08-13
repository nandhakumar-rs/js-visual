import type { Comparison } from "./types";

/** How the second object is produced from the first. */
export type BuildStyle = "alias" | "spread" | "literal" | "clone";

export const BUILD_LABEL: Record<BuildStyle, string> = {
  alias: "= a",
  spread: "{ ...a }",
  literal: "literal",
  clone: "structuredClone",
};

const BUILD_SOURCE: Record<BuildStyle, string> = {
  alias: "const b = a;",
  spread: "const b = { ...a };",
  literal: 'const b = { id: 1, address: { city: "Chennai" } };',
  clone: "const b = structuredClone(a);",
};

const SUBJECT = 'const a = { id: 1, address: { city: "Chennai" } };';

/** The helper the lesson wrote in its second scenario, reused verbatim. */
function shallowEqual(x: Record<string, unknown>, y: Record<string, unknown>): boolean {
  const keys = Object.keys(x);
  if (keys.length !== Object.keys(y).length) return false;
  return keys.every((key) => x[key] === y[key]);
}

export function buildCode(style: BuildStyle): string[] {
  return [
    SUBJECT,
    BUILD_SOURCE[style],
    "",
    "a === b;",
    "shallowEqual(a, b);",
    "a.address === b.address;",
    "JSON.stringify(a) === JSON.stringify(b);",
  ];
}

interface Subject {
  id: number;
  address: { city: string };
}

function makeA(): Subject {
  return { id: 1, address: { city: "Chennai" } };
}

function makeB(style: BuildStyle, a: Subject): Subject {
  if (style === "alias") return a;
  if (style === "spread") return { ...a };
  if (style === "literal") return { id: 1, address: { city: "Chennai" } };
  return structuredClone(a);
}

/**
 * Runs the four comparisons for real and returns what they evaluated to. No
 * lookup table: every cell the panel shows is the result of actually running
 * that expression, the same approach the Microtask Queue and Async / Await
 * experiments take.
 */
export function runCase(style: BuildStyle): Comparison[] {
  const a = makeA();
  const b = makeB(style, a);

  return [
    {
      id: "identity",
      label: "a === b",
      result: a === b,
      note: style === "alias" ? "One object, two names." : "Two different objects.",
    },
    {
      id: "shallow",
      label: "shallowEqual(a, b)",
      result: shallowEqual(
        a as unknown as Record<string, unknown>,
        b as unknown as Record<string, unknown>
      ),
      note:
        style === "alias" || style === "spread"
          ? "Both hold the same nested address."
          : "The nested address is a different object.",
    },
    {
      id: "nested",
      label: "a.address === b.address",
      result: a.address === b.address,
      note:
        style === "alias" || style === "spread"
          ? "Copied by reference, so still shared."
          : "A separate address object was created.",
    },
    {
      id: "json",
      label: "JSON.stringify(a) === JSON.stringify(b)",
      result: JSON.stringify(a) === JSON.stringify(b),
      note: "True for every build here — which is exactly why it is a trap.",
    },
  ];
}
