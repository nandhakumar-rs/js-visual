/** How many independent steps the generated program has. */
export type StepCount = "2" | "3" | "4";

/** Whether the steps are awaited one at a time or started together. */
export type StartStyle = "one-at-a-time" | "all-at-once";

export const START_LABEL: Record<StartStyle, string> = {
  "one-at-a-time": "One at a time",
  "all-at-once": "All at once",
};

/** Every step takes the same time, so the totals are easy to read off. */
export const STEP_MS = 200;

const NAMES = ["users", "orders", "items", "supplier"] as const;

export interface ExperimentCase {
  code: string[];
  steps: number;
  start: StartStyle;
}

/**
 * Generates the program the panel will actually execute, so the code shown and
 * the code measured are the same shape. Each step is independent — none of them
 * needs a previous result, which is exactly why awaiting them in turn is a
 * choice rather than a requirement.
 */
export function buildCase(steps: StepCount, start: StartStyle): ExperimentCase {
  const count = Number(steps);
  const names = NAMES.slice(0, count);
  const code: string[] = [];

  if (start === "one-at-a-time") {
    for (const name of names) {
      code.push(`const ${name} = await get${cap(name)}();`);
    }
  } else {
    code.push(`const [${names.join(", ")}] = await Promise.all([`);
    for (const name of names) {
      code.push(`  get${cap(name)}(),`);
    }
    code.push("]);");
  }

  return { code, steps: count, start };
}

function cap(name: string): string {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
}

export interface Mark {
  label: string;
  atMs: number;
}

export interface RunResult {
  totalMs: number;
  marks: Mark[];
}

const delay = <T,>(ms: number, value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * Runs the generated shape for real and reports what it measured, rather than
 * predicting it. Same approach as the Microtask Queue lesson's experiment: the
 * numbers the learner reads are the ones their browser just produced.
 */
export async function runCase(steps: number, start: StartStyle): Promise<RunResult> {
  const t0 = performance.now();
  const marks: Mark[] = [];
  const since = () => Math.round(performance.now() - t0);
  const names = NAMES.slice(0, steps);

  if (start === "one-at-a-time") {
    for (const name of names) {
      await delay(STEP_MS, name);
      marks.push({ label: name, atMs: since() });
    }
  } else {
    await Promise.all(
      names.map((name) =>
        delay(STEP_MS, name).then(() => {
          marks.push({ label: name, atMs: since() });
        })
      )
    );
  }

  return { totalMs: since(), marks };
}
