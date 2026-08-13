import {
  buildNested,
  buildPromiseChain,
  measure,
  type ShapeMetrics,
} from "@/lib/lessons/async-pipeline";

/** How many dependent steps the chain has. */
export type StepCount = "2" | "3" | "4" | "5";

/** Which shape the same chain is written in. */
export type Shape = "callbacks" | "promises";

export const SHAPE_LABEL: Record<Shape, string> = {
  callbacks: "Nested callbacks",
  promises: "Promise chain",
};

export interface ExperimentCase {
  code: string[];
  metrics: ShapeMetrics;
  /** 1-based line to highlight — the deepest line, where the shape shows. */
  readLine: number;
  badge: string;
  explanation: string;
}

/**
 * The same dependent chain, generated in both shapes from the same PIPELINE
 * and measured by the same `measure()` the Callback Hell experiment uses — so
 * the two lessons' figures are directly comparable, and the numbers in the
 * reveal are derived from the code shown beside them rather than asserted.
 */
export function buildCase(count: StepCount, shape: Shape): ExperimentCase {
  const steps = Number(count);
  const code = shape === "callbacks" ? buildNested(steps, true) : buildPromiseChain(steps, true);
  const metrics = measure(code);

  // Matched on the trimmed start: in the callback form every error check also
  // contains a `console.log(`, and the first of those sits on line 2.
  const deepest = code.findIndex((line) => line.trimStart().startsWith("console.log(")) + 1;

  if (shape === "callbacks") {
    return {
      code,
      metrics,
      readLine: deepest,
      badge: `${metrics.depth} LEVELS DEEP`,
      explanation:
        "Each step is written inside the previous step's callback, so depth and the number of error checks both grow with the number of steps. The highlighted line is the one that does the actual work.",
    };
  }

  return {
    code,
    metrics,
    // The last `.then`, which is the equivalent line — and it is at the same
    // indent as every other line in the chain.
    readLine: code.findIndex((line) => line.trimStart().startsWith(".then((") && line.includes("console.log(")) + 1,
    badge: "STAYS FLAT AT ANY LENGTH",
    explanation:
      "The same steps, written as a list instead of a nest. Adding a step adds one line in the middle and shifts nothing: depth stays at 1 and the single `.catch` still covers every step, however long the chain gets.",
  };
}
