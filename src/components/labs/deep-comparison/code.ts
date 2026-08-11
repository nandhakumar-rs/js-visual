import type { DeepComparisonInputs } from "./types";

export function getCode({ nameA, nameB, cityA, cityB }: DeepComparisonInputs): string[] {
  return [
    `const a = { name: ${JSON.stringify(nameA)}, address: { city: ${JSON.stringify(cityA)} } };`,
    `const b = { name: ${JSON.stringify(nameB)}, address: { city: ${JSON.stringify(cityB)} } };`,
    "",
    "function deepEqual(x, y) {",
    "  if (x === y) return true;",
    '  if (typeof x !== "object" || typeof y !== "object") return false;',
    "",
    "  const keys = Object.keys(x);",
    "  return keys.every(key => deepEqual(x[key], y[key]));",
    "}",
    "",
    "deepEqual(a, b);",
  ];
}
