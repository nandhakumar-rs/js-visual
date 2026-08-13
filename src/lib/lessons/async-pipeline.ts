/**
 * One ordered chain of dependent steps, shared by the scenarios and the
 * experiment. Every step needs the previous step's result, so "how many steps"
 * and "how deep the nesting goes" are the same number — which is the lesson.
 *
 * The step functions themselves are never defined in the lesson's code panels:
 * the Callbacks lesson already showed what `getUser(id, callback)` looks like
 * inside, and defining five of them would bury the shape being taught.
 */
export const PIPELINE = [
  { fn: "getUser", arg: "1", result: "user" },
  { fn: "getOrders", arg: "user.id", result: "orders" },
  { fn: "getItems", arg: "orders[0].id", result: "items" },
  { fn: "getSupplier", arg: "items[0].supplierId", result: "supplier" },
  { fn: "getAddress", arg: "supplier.id", result: "address" },
] as const;

export const MAX_STEPS = PIPELINE.length;

const ERROR_CHECK = 'if (error) return console.log("Failed:", error.message);';

function indent(level: number): string {
  return "  ".repeat(level);
}

/**
 * The nested form: each step's call is written inside the previous step's
 * callback, because that is the only place the previous result is in scope.
 *
 * Line count is `steps` calls + `steps` closing braces + one log, plus one
 * error check per level when `withErrorChecks` is set.
 */
export function buildNested(steps: number, withErrorChecks: boolean): string[] {
  const lines: string[] = [];

  for (let i = 0; i < steps; i++) {
    const { fn, arg, result } = PIPELINE[i];
    const params = withErrorChecks ? `(error, ${result})` : `(${result})`;
    lines.push(`${indent(i)}${fn}(${arg}, ${params} => {`);
    if (withErrorChecks) lines.push(`${indent(i + 1)}${ERROR_CHECK}`);
  }

  lines.push(`${indent(steps)}console.log(${PIPELINE[steps - 1].result});`);

  for (let i = steps - 1; i >= 0; i--) {
    lines.push(`${indent(i)}});`);
  }

  return lines;
}

/** `handleUser`, `handleOrders`, … — one per level, named for what it receives. */
function handlerName(i: number): string {
  const result = PIPELINE[i].result;
  return `handle${result[0].toUpperCase()}${result.slice(1)}`;
}

/**
 * The flattened form: the same chain with each callback lifted into a named
 * function. Indentation stops growing — but the handlers have to be declared
 * before they are referenced, so the chain is emitted deepest-first and the
 * call that actually starts it lands on the very last line.
 */
export function buildNamed(steps: number): string[] {
  const lines: string[] = [];

  for (let i = steps - 1; i >= 0; i--) {
    const { result } = PIPELINE[i];
    lines.push(`function ${handlerName(i)}(error, ${result}) {`);
    lines.push(`  ${ERROR_CHECK}`);
    if (i === steps - 1) {
      lines.push(`  console.log(${result});`);
    } else {
      const next = PIPELINE[i + 1];
      lines.push(`  ${next.fn}(${next.arg}, ${handlerName(i + 1)});`);
    }
    lines.push("}");
    lines.push("");
  }

  lines.push(`${PIPELINE[0].fn}(${PIPELINE[0].arg}, ${handlerName(0)});`);

  return lines;
}

/**
 * The promise form: `.then` returns a new promise, so the handlers attach to
 * each other in a list instead of nesting. Returning the next step's promise
 * from inside a handler is what lets the chain wait for it without indenting.
 *
 * Line count is `steps + 1`, plus one for the catch. Every line sits at indent
 * 0 or 2, so the depth stays 1 however long the chain gets.
 */
export function buildPromiseChain(steps: number, withCatch: boolean): string[] {
  const lines = [`${PIPELINE[0].fn}(${PIPELINE[0].arg})`];

  for (let i = 1; i < steps; i++) {
    const previous = PIPELINE[i - 1].result;
    const { fn, arg } = PIPELINE[i];
    lines.push(`  .then((${previous}) => ${fn}(${arg}))`);
  }

  const last = PIPELINE[steps - 1].result;
  lines.push(`  .then((${last}) => console.log(${last}))${withCatch ? "" : ";"}`);

  if (withCatch) {
    lines.push('  .catch((error) => console.log("Failed:", error.message));');
  }

  return lines;
}

export interface ShapeMetrics {
  /** Deepest indentation level in the code, in nesting levels. */
  depth: number;
  /**
   * How many places the code handles a failure. Counts both the callback form
   * (one `if (error)` per level) and the promise form (a single `.catch`) — a
   * `.catch` is not a check, which is why this is not named errorChecks.
   */
  errorHandlers: number;
  lines: number;
  /** 1-based line where the chain actually starts running. */
  chainStartLine: number;
}

/**
 * Every metric is measured off the generated array rather than predicted from
 * `steps`, so the numbers shown to the learner cannot drift from the code
 * shown next to them.
 */
export function measure(code: string[]): ShapeMetrics {
  let depth = 0;
  let errorHandlers = 0;

  for (const line of code) {
    if (line.trim() === "") continue;
    const leading = line.length - line.trimStart().length;
    depth = Math.max(depth, leading / 2);
    if (line.includes("if (error)") || line.includes(".catch(")) errorHandlers++;
  }

  // Matched without the trailing comma, so it finds the entry call in all
  // three forms: `getUser(1, ...)`, `getUser(1, handleUser);` and `getUser(1)`.
  const entry = `${PIPELINE[0].fn}(${PIPELINE[0].arg}`;
  return {
    depth,
    errorHandlers,
    lines: code.length,
    chainStartLine: code.findIndex((line) => line.trimStart().startsWith(entry)) + 1,
  };
}
