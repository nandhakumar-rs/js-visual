import type { ExecutionStep } from "@/lib/execution/types";
import type { HoistingInputs, HoistingStepState } from "./types";

/**
 * activeCodeLines are 1-BASED line numbers (CodePanel compares against
 * `index + 1`), and they must match the corresponding array in code.ts.
 *
 * The preparation steps deliberately highlight no line at all. Nothing is
 * executing during preparation, and highlighting the declaration line there
 * would suggest the very thing this lesson is disproving — that the line
 * somehow ran early, or moved.
 */
export function buildInitialSteps({ scenario }: HoistingInputs): ExecutionStep<HoistingStepState>[] {
  if (scenario === "var") return buildVarSteps();
  if (scenario === "let-const") return buildLetSteps();
  return buildFunctionSteps();
}

function buildVarSteps(): ExecutionStep<HoistingStepState>[] {
  const base = { identifier: "status", declaredWith: "var" as const };

  return [
    {
      id: "call",
      title: "inspectVar() is called",
      description: "The call starts a run of the function body, so JavaScript sets up a scope for it.",
      whyExplanation:
        "Nothing inside the function has happened yet. Calling `inspectVar()` is what makes JavaScript set up the scope its body will run in.",
      activeCodeLines: [7],
      state: {
        ...base,
        phase: "entering",
        bindingState: "none",
        readResult: "The scope does not exist yet.",
      },
    },
    {
      id: "prepare",
      title: "The function scope is prepared",
      description:
        "Before running any statement, JavaScript looks through the whole body and creates a binding for every declaration it finds.",
      whyExplanation:
        "JavaScript reads the body first and collects its declarations. This preparation is what people are describing when they say a declaration is *hoisted* — the source code itself never moves.",
      activeCodeLines: [],
      state: {
        ...base,
        phase: "preparing",
        bindingState: "none",
        readResult: "The binding is being created.",
      },
    },
    {
      id: "created",
      title: "status is initialized with undefined",
      description:
        "A var binding is initialized with undefined during preparation. Line 3 has not run — only the declaration was prepared, not the assignment.",
      whyExplanation:
        "`var` bindings are initialized with `undefined` as soon as the scope is prepared. That is why reading `status` early does not fail — it already holds a value, just not `\"Ready\"` yet.",
      activeCodeLines: [],
      state: {
        ...base,
        phase: "preparing",
        bindingState: "initialized-undefined",
        displayValue: "undefined",
        readResult: "undefined",
      },
    },
    {
      id: "log-before",
      title: "The first read logs undefined",
      description: "The statement runs above the declaration line, and reading status is allowed because it already exists.",
      whyExplanation:
        "The binding was already initialized during preparation, so this read is legal. It reports the value the binding actually holds right now: `undefined`.",
      activeCodeLines: [2],
      consoleOutput: [
        { id: "var-log1-cmd", kind: "command", content: "console.log(status)" },
        { id: "var-log1-out", kind: "output", content: "undefined" },
      ],
      state: {
        ...base,
        phase: "before-declaration",
        bindingState: "initialized-undefined",
        displayValue: "undefined",
        readResult: "undefined",
      },
    },
    {
      id: "assign",
      title: 'The declaration assigns "Ready"',
      description: "Now line 3 actually executes. The assignment always waits for its own line — only the declaration was prepared early.",
      whyExplanation:
        "Preparation created the binding; execution gives it its value. The assignment happens here, on its own line, in normal top-to-bottom order.",
      activeCodeLines: [3],
      state: {
        ...base,
        phase: "after-declaration",
        bindingState: "initialized-value",
        displayValue: '"Ready"',
        previousDisplayValue: "undefined",
        readResult: '"Ready"',
      },
    },
    {
      id: "log-after",
      title: 'The second read logs "Ready"',
      description: "Below the declaration line, status holds the assigned value.",
      whyExplanation:
        "Same binding, same read — only the timing changed. After its declaration line has run, `status` holds `\"Ready\"`.",
      activeCodeLines: [4],
      consoleOutput: [
        { id: "var-log2-cmd", kind: "command", content: "console.log(status)" },
        { id: "var-log2-out", kind: "output", content: '"Ready"' },
      ],
      state: {
        ...base,
        phase: "after-declaration",
        bindingState: "initialized-value",
        displayValue: '"Ready"',
        readResult: '"Ready"',
      },
    },
  ];
}

function buildLetSteps(): ExecutionStep<HoistingStepState>[] {
  const base = { identifier: "status", declaredWith: "let" as const };

  return [
    {
      id: "call",
      title: "inspectLet() is called",
      description: "The call starts a run of the function body, so JavaScript sets up a scope for it.",
      whyExplanation:
        "Nothing inside the function has happened yet. Calling `inspectLet()` is what makes JavaScript set up the scope its body will run in.",
      activeCodeLines: [6],
      state: {
        ...base,
        phase: "entering",
        bindingState: "none",
        readResult: "The scope does not exist yet.",
      },
    },
    {
      id: "prepare",
      title: "The function scope is prepared",
      description:
        "Before running any statement, JavaScript looks through the whole body and creates a binding for every declaration it finds.",
      whyExplanation:
        "Preparation works the same way for every declaration kind. What differs is how each binding is initialized once it has been created.",
      activeCodeLines: [],
      state: {
        ...base,
        phase: "preparing",
        bindingState: "none",
        readResult: "The binding is being created.",
      },
    },
    {
      id: "created",
      title: "The status binding exists, but is uninitialized",
      description:
        "The binding was created, but no value was put in it. This uninitialized period is the Temporal Dead Zone.",
      whyExplanation:
        "`let` bindings are created during preparation like every other declaration, but they are left *uninitialized*. Uninitialized is not the same as holding `undefined` — there is no value there at all yet.",
      activeCodeLines: [],
      state: {
        ...base,
        phase: "preparing",
        bindingState: "uninitialized",
        displayValue: "<uninitialized>",
        readResult: "ReferenceError — cannot be read yet",
      },
    },
    {
      id: "read-attempt",
      title: "Execution tries to read status",
      description: "The first statement runs above the declaration line, so the binding is still uninitialized.",
      whyExplanation:
        "The lookup itself succeeds — `status` is right here in the current scope. Reading it is what fails, because the binding has no value yet.",
      activeCodeLines: [2],
      consoleOutput: [{ id: "let-cmd", kind: "command", content: "console.log(status)" }],
      state: {
        ...base,
        phase: "before-declaration",
        bindingState: "uninitialized",
        displayValue: "<uninitialized>",
        readResult: "ReferenceError — cannot be read yet",
      },
    },
    {
      id: "throw",
      title: "A ReferenceError is thrown",
      description:
        "Reading an uninitialized binding throws. const behaves the same way before its declaration line.",
      whyExplanation:
        "`const` behaves the same way before its declaration: its binding is uninitialized and reading it throws a `ReferenceError`. The difference between `let` and `const` only matters after the declaration has run.",
      activeCodeLines: [2],
      consoleOutput: [
        {
          id: "let-err",
          kind: "error",
          content: "Uncaught ReferenceError: Cannot access 'status' before initialization",
        },
      ],
      state: {
        ...base,
        phase: "before-declaration",
        bindingState: "uninitialized",
        displayValue: "<uninitialized>",
        readResult: "ReferenceError — thrown",
      },
    },
    {
      id: "stop",
      title: "Execution stops",
      description: "The uncaught error ends this run of the function. Line 3 never executes.",
      whyExplanation:
        "Because the declaration line is never reached, the binding is never initialized. The Temporal Dead Zone ended the run instead of ending normally.",
      activeCodeLines: [2],
      state: {
        ...base,
        phase: "halted",
        bindingState: "halted",
        displayValue: "<uninitialized>",
        readResult: "ReferenceError — execution stopped",
      },
    },
  ];
}

function buildFunctionSteps(): ExecutionStep<HoistingStepState>[] {
  const base = { identifier: "startLesson", declaredWith: "function" as const };

  return [
    {
      id: "call",
      title: "runLesson() is called",
      description: "The call starts a run of the outer function body, so JavaScript sets up a scope for it.",
      whyExplanation:
        "Everything in this example happens inside `runLesson()`. Calling it is what makes JavaScript set up the scope its body will run in.",
      activeCodeLines: [9],
      state: {
        ...base,
        phase: "entering",
        bindingState: "none",
        readResult: "The scope does not exist yet.",
      },
    },
    {
      id: "prepare",
      title: "Its scope is prepared",
      description: "Before running any statement, JavaScript looks through the body and finds the startLesson declaration.",
      whyExplanation:
        "Preparation covers the whole body at once, so a declaration written further down is already known before the first statement runs.",
      activeCodeLines: [],
      state: {
        ...base,
        phase: "preparing",
        bindingState: "none",
        readResult: "The binding is being created.",
      },
    },
    {
      id: "created",
      title: "startLesson is initialized with the function",
      description:
        "A function declaration is initialized during preparation with the function itself — not with undefined, and not left uninitialized.",
      whyExplanation:
        "This is what makes function declarations different: the binding is created *and* initialized with the function during preparation, so it is fully callable before its own line runs.",
      activeCodeLines: [],
      state: {
        ...base,
        phase: "preparing",
        bindingState: "function-ready",
        displayValue: "ƒ startLesson()",
        readResult: "ƒ startLesson() — callable",
      },
    },
    {
      id: "reach-call",
      title: "Execution reaches startLesson() before its declaration line",
      description: "The call sits on line 2, above the declaration on line 4.",
      whyExplanation:
        "The declaration on line 4 has still not executed. It did not need to — the binding was already initialized when the scope was prepared.",
      activeCodeLines: [2],
      state: {
        ...base,
        phase: "before-declaration",
        bindingState: "function-ready",
        displayValue: "ƒ startLesson()",
        readResult: "ƒ startLesson() — callable",
      },
    },
    {
      id: "invoke",
      title: "The function call succeeds",
      description: "startLesson holds a real function, so calling it enters the body declared on line 4.",
      whyExplanation:
        "Nothing special happens here — this is an ordinary call. It only looks unusual because it is written above the declaration.",
      activeCodeLines: [4],
      state: {
        ...base,
        phase: "before-declaration",
        bindingState: "function-ready",
        displayValue: "ƒ startLesson()",
        readResult: "ƒ startLesson() — callable",
      },
    },
    {
      id: "log",
      title: '"Ready" is logged',
      description: "The function body runs and prints its message.",
      whyExplanation:
        "The call worked and produced its output, which is the whole point: a function declaration can be used before the line it is written on.",
      activeCodeLines: [5],
      consoleOutput: [
        { id: "fn-cmd", kind: "command", content: "startLesson()" },
        { id: "fn-out", kind: "output", content: '"Ready"' },
      ],
      state: {
        ...base,
        phase: "before-declaration",
        bindingState: "function-ready",
        displayValue: "ƒ startLesson()",
        readResult: "ƒ startLesson() — callable",
      },
    },
  ];
}
