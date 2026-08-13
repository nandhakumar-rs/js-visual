/** How many `.then` handlers the chain has. */
export type Handlers = "1" | "2" | "3";

/** Whether the setTimeout is written before or after the promise chain. */
export type TimerPosition = "before" | "after";

export const POSITION_LABEL: Record<TimerPosition, string> = {
  before: "Before the chain",
  after: "After the chain",
};

const TIMER = 'setTimeout(() => log("setTimeout"), 0);';

export interface ExperimentCase {
  code: string[];
  /** 1-based line of the setTimeout call — the line whose position is varied. */
  readLine: number;
  handlers: number;
  position: TimerPosition;
}

/**
 * Generates the program the panel will actually execute, so the code shown and
 * the code measured are the same thing.
 */
export function buildCase(handlers: Handlers, position: TimerPosition): ExperimentCase {
  const count = Number(handlers);
  const code: string[] = [];

  if (position === "before") code.push(TIMER, "");

  code.push("Promise.resolve()");
  for (let i = 1; i <= count; i++) {
    const end = i === count ? ";" : "";
    code.push(`  .then(() => log(".then #${i}"))${end}`);
  }

  if (position === "after") code.push("", TIMER);

  code.push("", 'log("sync");');

  return {
    code,
    readLine: code.findIndex((line) => line.startsWith("setTimeout")) + 1,
    handlers: count,
    position,
  };
}

/**
 * Runs the generated program for real and returns the order the calls actually
 * logged in, rather than a predicted order. Same approach as the Event Loop
 * lesson's experiment — the point of the panel is that the observed order is
 * the same whichever position the timer is written in.
 */
export function runCase(handlers: number, position: TimerPosition): Promise<string[]> {
  return new Promise((resolve) => {
    const order: string[] = [];
    // Explicitly void: `push` returns a number, which would otherwise widen
    // the `.then` chain's type away from Promise<void>.
    const log = (label: string): void => {
      order.push(label);
    };
    const schedule = () => setTimeout(() => log("setTimeout"), 0);

    if (position === "before") schedule();

    let chain = Promise.resolve();
    for (let i = 1; i <= handlers; i++) {
      chain = chain.then(() => log(`.then #${i}`));
    }

    if (position === "after") schedule();

    log("sync");

    // Settle well after the 0ms timer so the captured order is complete.
    setTimeout(() => resolve(order), 30);
  });
}
