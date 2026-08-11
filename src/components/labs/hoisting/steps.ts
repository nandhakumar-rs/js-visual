import type { ExecutionStep } from "@/lib/execution/types";
import type { HoistingInputs, HoistingStepState } from "./types";

export function buildInitialSteps({ declarationType }: HoistingInputs): ExecutionStep<HoistingStepState>[] {
  if (declarationType === "function") {
    return buildFunctionSteps();
  }
  if (declarationType === "var") {
    return buildVarSteps();
  }
  return buildLetConstSteps(declarationType);
}

function buildVarSteps(): ExecutionStep<HoistingStepState>[] {
  return [
    {
      id: "creation",
      title: "Creation Phase",
      description:
        "Before any line runs, JavaScript scans the code and sets up name. var declarations are initialized to undefined immediately.",
      whyExplanation:
        "During the creation phase, JavaScript allocates memory for every var declaration in scope and initializes it to undefined — before your code ever starts executing top to bottom.",
      activeCodeLines: [],
      state: {
        phase: "creation",
        binding: { name: "name", status: "undefined" },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
    {
      id: "log",
      title: "Execution: console.log(name)",
      description: "name already exists (as undefined), so this doesn't throw — it just logs undefined.",
      whyExplanation:
        "name was already created and set to undefined during the creation phase, so reading it here is legal. It just isn't Sam yet.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "log-1", kind: "command", content: "console.log(name)" }, { id: "log-2", kind: "output", content: "undefined" }],
      state: {
        phase: "execution",
        binding: { name: "name", status: "undefined" },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
    {
      id: "assign",
      title: "Execution: name = \"Sam\"",
      description: "Now the assignment actually runs, and name is updated from undefined to \"Sam\".",
      whyExplanation:
        "The assignment name = \"Sam\" only happens when this line executes — hoisting only affects the declaration, never the assignment.",
      activeCodeLines: [2],
      state: {
        phase: "execution",
        binding: { name: "name", status: "updated", previousValue: undefined, displayValue: '"Sam"' },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
  ];
}

function buildLetConstSteps(declarationType: "let" | "const"): ExecutionStep<HoistingStepState>[] {
  return [
    {
      id: "creation",
      title: "Creation Phase",
      description: `${declarationType} creates the binding name, but leaves it uninitialized — this is the Temporal Dead Zone (TDZ).`,
      whyExplanation:
        `${declarationType} declarations are hoisted too — the name binding exists from the start of the scope. But unlike var, it is not initialized until its declaration line actually runs, so it sits in the "Temporal Dead Zone" until then.`,
      activeCodeLines: [],
      state: {
        phase: "creation",
        binding: { name: "name", status: "tdz", displayValue: "<uninitialized>" },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
    {
      id: "log",
      title: "Execution: console.log(name)",
      description: "name exists, but it's still in the Temporal Dead Zone — accessing it now throws.",
      whyExplanation:
        `name is hoisted, but it is NOT initialized yet — that only happens on line 2. Reading a TDZ binding always throws a ReferenceError. This is why "let isn't hoisted" is a misleading way to describe it: it IS hoisted, it's just inaccessible.`,
      activeCodeLines: [1],
      consoleOutput: [
        { id: "log-1", kind: "command", content: "console.log(name)" },
        { id: "log-2", kind: "error", content: "Uncaught ReferenceError: Cannot access 'name' before initialization" },
      ],
      state: {
        phase: "execution",
        binding: { name: "name", status: "error", displayValue: "TDZ" },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
    {
      id: "halted",
      title: "Execution halts",
      description: `The thrown ReferenceError stops the script here — line 2 (${declarationType} name = "Sam";) never runs.`,
      whyExplanation:
        "An uncaught error stops execution of the current script/function, so the assignment on line 2 is never reached in this example.",
      activeCodeLines: [],
      state: {
        phase: "halted",
        binding: { name: "name", status: "error", displayValue: "TDZ" },
        callStack: [],
      },
    },
  ];
}

function buildFunctionSteps(): ExecutionStep<HoistingStepState>[] {
  return [
    {
      id: "creation",
      title: "Creation Phase",
      description: "Function declarations are fully hoisted — the entire function body is available before line 1 runs.",
      whyExplanation:
        "Unlike var (hoisted as undefined) or let/const (hoisted but uninitialized), a function declaration is hoisted together with its full definition, so it can be called before the line it's written on.",
      activeCodeLines: [],
      state: {
        phase: "creation",
        binding: { name: "sayHello", status: "set", displayValue: "ƒ sayHello()" },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
    {
      id: "call",
      title: "Execution: sayHello()",
      description: "sayHello is already defined, so calling it here works fine and pushes a new frame onto the call stack.",
      whyExplanation: "Because the whole function was hoisted, calling it above its declaration is completely valid.",
      activeCodeLines: [1],
      consoleOutput: [{ id: "call-1", kind: "command", content: "sayHello()" }],
      state: {
        phase: "execution",
        binding: { name: "sayHello", status: "set", displayValue: "ƒ sayHello()" },
        callStack: [
          { id: "global", label: "global" },
          { id: "sayHello", label: "sayHello()", isActive: true },
        ],
      },
    },
    {
      id: "log",
      title: 'Inside sayHello: console.log("hi")',
      description: "Now the function body runs and logs \"hi\".",
      whyExplanation: "This line only executes once sayHello() is actually called and its frame runs.",
      activeCodeLines: [3],
      consoleOutput: [{ id: "log-1", kind: "output", content: "hi" }],
      state: {
        phase: "execution",
        binding: { name: "sayHello", status: "set", displayValue: "ƒ sayHello()" },
        callStack: [
          { id: "global", label: "global" },
          { id: "sayHello", label: "sayHello()", isActive: true },
        ],
      },
    },
    {
      id: "return",
      title: "sayHello() returns",
      description: "The function finishes and its frame is popped off the call stack.",
      whyExplanation: "Once a function finishes running, its call-stack frame is removed and control returns to global scope.",
      activeCodeLines: [1],
      state: {
        phase: "execution",
        binding: { name: "sayHello", status: "set", displayValue: "ƒ sayHello()" },
        callStack: [{ id: "global", label: "global", isActive: true }],
      },
    },
  ];
}
