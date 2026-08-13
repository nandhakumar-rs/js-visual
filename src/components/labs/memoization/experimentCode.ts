/** How many distinct inputs arrive, over a fixed number of calls. */
export type Distinct = "5" | "50" | "500" | "1000";

export const TOTAL_CALLS = 1000;

export const DISTINCT_LABEL: Record<Distinct, string> = {
  "5": "5",
  "50": "50",
  "500": "500",
  "1000": "1000",
};

export interface RunResult {
  hits: number;
  misses: number;
  entries: number;
  /** 0–100, rounded to one decimal place. */
  hitRate: number;
}

/**
 * Runs the calls for real against a real Map and counts what happened. Inputs
 * arrive round-robin rather than randomly, so the result is the same every time
 * and the learner can reason about it — the point is the shape of the trade,
 * not a simulation of production traffic.
 */
export function runCase(distinct: Distinct): RunResult {
  const k = Number(distinct);
  const cache = new Map<number, number>();
  let hits = 0;
  let misses = 0;

  for (let i = 0; i < TOTAL_CALLS; i++) {
    const input = i % k;
    if (cache.has(input)) {
      hits++;
      continue;
    }
    misses++;
    cache.set(input, input * 50);
  }

  return {
    hits,
    misses,
    entries: cache.size,
    hitRate: Math.round((hits / TOTAL_CALLS) * 1000) / 10,
  };
}

export function buildCode(distinct: Distinct): string[] {
  return [
    `// ${TOTAL_CALLS} calls, ${distinct} distinct inputs`,
    "const cache = new Map();",
    "",
    `for (let i = 0; i < ${TOTAL_CALLS}; i++) {`,
    `  priceFor(i % ${distinct});`,
    "}",
    "",
    "cache.size;",
  ];
}
