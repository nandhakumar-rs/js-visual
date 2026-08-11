export function getCode(): string[] {
  return [
    "function createCounter() {",
    "  let count = 0;",
    "",
    "  return function () {",
    "    count++;",
    "    return count;",
    "  };",
    "}",
  ];
}
