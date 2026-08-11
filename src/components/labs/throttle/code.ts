import type { ThrottleInputs } from "./types";

export function getCode({ intervalMs }: ThrottleInputs): string[] {
  return [
    "function throttle(fn, interval) {",
    "  let isBlocked = false;",
    "",
    "  return (...args) => {",
    "    if (isBlocked) return;",
    "",
    "    fn(...args);",
    "    isBlocked = true;",
    "    setTimeout(() => { isBlocked = false; }, interval);",
    "  };",
    "}",
    "",
    `const throttledHandler = throttle(handleScroll, ${intervalMs});`,
  ];
}
