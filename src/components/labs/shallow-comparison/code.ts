import type { ShallowComparisonInputs } from "./types";

export function getCode({ nameA, nameB, cityA, cityB, shareAddressRef }: ShallowComparisonInputs): string[] {
  return [
    `const a = { name: ${JSON.stringify(nameA)}, address: { city: ${JSON.stringify(cityA)} } };`,
    shareAddressRef
      ? `const b = { name: ${JSON.stringify(nameB)}, address: a.address };`
      : `const b = { name: ${JSON.stringify(nameB)}, address: { city: ${JSON.stringify(cityB)} } };`,
    "",
    "function shallowEqual(x, y) {",
    "  return x.name === y.name && x.address === y.address;",
    "}",
    "",
    "shallowEqual(a, b);",
  ];
}
