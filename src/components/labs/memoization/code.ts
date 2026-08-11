export function getCode(): string[] {
  return [
    "const cache = new Map();",
    "",
    "function slowCalculation(n) {",
    "  if (cache.has(n)) {",
    "    return cache.get(n);",
    "  }",
    "",
    "  const result = n * 3; // pretend this is slow",
    "  cache.set(n, result);",
    "  return result;",
    "}",
  ];
}
