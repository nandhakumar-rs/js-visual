import type { RetryInputs } from "./types";

export function getCode({ maxRetries, retryDelayMs, exponentialBackoff }: RetryInputs): string[] {
  return [
    "async function fetchWithRetry(url, maxRetries) {",
    "  for (let attempt = 1; attempt <= maxRetries; attempt++) {",
    "    try {",
    "      return await fetch(url);",
    "    } catch (error) {",
    "      if (attempt === maxRetries) throw error;",
    exponentialBackoff
      ? `      await wait(${retryDelayMs} * 2 ** (attempt - 1));`
      : `      await wait(${retryDelayMs});`,
    "    }",
    "  }",
    "}",
    "",
    `fetchWithRetry("/data", ${maxRetries});`,
  ];
}
