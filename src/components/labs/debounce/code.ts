import type { DebounceInputs } from "./types";

export function getCode({ delayMs }: DebounceInputs): string[] {
  return [
    "function debounce(fn, delay) {",
    "  let timer;",
    "",
    "  return (...args) => {",
    "    clearTimeout(timer);",
    "    timer = setTimeout(() => fn(...args), delay);",
    "  };",
    "}",
    "",
    `const debouncedSearch = debounce(search, ${delayMs});`,
  ];
}
