/** How long the stack is held busy by synchronous work. */
export type BlockMs = "0" | "50" | "200" | "800";

/** The delay asked for. */
export type DelayMs = "0" | "100" | "500";

export interface ExperimentCase {
  code: string[];
  /** 1-based line of the `while` block, or the setTimeout when there is none. */
  readLine: number;
  requestedMs: number;
  blockMs: number;
}

/**
 * Generates the program the panel will actually execute, so the code shown and
 * the code measured are the same thing. The `while` line is omitted entirely
 * when the block is 0 rather than emitting a no-op `while (… < 0) {}`.
 */
export function buildCase(block: BlockMs, delay: DelayMs): ExperimentCase {
  const blockMs = Number(block);
  const requestedMs = Number(delay);

  const code = [
    "const start = Date.now();",
    "",
    "setTimeout(() => {",
    "  console.log(Date.now() - start);",
    `}, ${requestedMs});`,
  ];

  if (blockMs > 0) {
    code.push("", `while (Date.now() - start < ${blockMs}) {}`);
  }

  return {
    code,
    // The blocking line is the point when there is one; otherwise the timer.
    readLine: blockMs > 0 ? code.length : 3,
    requestedMs,
    blockMs,
  };
}

export interface Measurement {
  /** Observed ms between scheduling and the callback running. */
  actualMs: number;
  lateByMs: number;
  ranAfterBlock: boolean;
}

/**
 * Runs the generated program for real and reports what was observed, rather
 * than computing max(block, delay). A panel labelled "actual delay" should be
 * showing a measurement — and at 800ms the brief stutter is the lesson
 * demonstrating itself.
 *
 * Only ever called from an explicit button press, and the block is capped at
 * 800ms by the control's options.
 */
export function measureOnce(blockMs: number, delayMs: number): Promise<Measurement> {
  return new Promise((resolve) => {
    const start = Date.now();

    setTimeout(() => {
      const actualMs = Date.now() - start;
      resolve({
        actualMs,
        lateByMs: Math.max(0, actualMs - delayMs),
        ranAfterBlock: blockMs > delayMs,
      });
    }, delayMs);

    // The block, on the real stack — exactly the `while` line shown in the code.
    while (Date.now() - start < blockMs) {
      /* deliberately spinning */
    }
  });
}
