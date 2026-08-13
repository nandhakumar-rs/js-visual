import { buildNamed, buildNested, measure, type ShapeMetrics } from "@/lib/lessons/async-pipeline";

/** How many dependent steps the chain has. */
export type StepCount = "2" | "3" | "4" | "5";

/** How the callbacks are written. */
export type Style = "nested" | "named";

export const STYLE_LABEL: Record<Style, string> = {
  nested: "Nested inline",
  named: "Named functions",
};

export interface ExperimentCase {
  code: string[];
  metrics: ShapeMetrics;
  /** 1-based line to highlight — the deepest line, which is where the shape shows. */
  readLine: number;
  badge: string;
  explanation: string;
}

/**
 * Code and metrics come from one call, and the metrics are measured off the
 * generated array rather than predicted — so the numbers in the reveal can
 * never disagree with the code shown beside them. Same guarantee the closures
 * and callbacks experiments give.
 *
 * Both styles carry one error check per level, which is what makes the
 * "error checks" figure a fair comparison: named functions do not remove a
 * single one.
 */
export function buildCase(count: StepCount, style: Style): ExperimentCase {
  const steps = Number(count);
  const code = style === "nested" ? buildNested(steps, true) : buildNamed(steps);
  const metrics = measure(code);

  if (style === "nested") {
    return {
      code,
      metrics,
      // The deepest line — the far corner of the pyramid. Matched on the
      // trimmed start, because every error check also contains a
      // `console.log(` and the first of those sits on line 2.
      readLine: code.findIndex((line) => line.trimStart().startsWith("console.log(")) + 1,
      badge: `${metrics.depth} LEVELS DEEP`,
      explanation:
        "Every step is written inside the previous step's callback, because that is the only place the previous result exists. Depth tracks the number of steps exactly, and the closing `});` lines pile up underneath.",
    };
  }

  return {
    code,
    metrics,
    // The entry call, which is the LAST line — that inversion is the finding.
    readLine: metrics.chainStartLine,
    badge: "FLAT, BUT BACKWARDS",
    explanation:
      "Lifting each callback into a named function flattens the indentation — and changes nothing else. There are still the same number of error checks, there are more lines than before, and the highlighted line is where the chain actually starts: the bottom of the file, with the steps listed above it in reverse.",
  };
}
