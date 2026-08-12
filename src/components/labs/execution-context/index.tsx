import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ExecutionContextControls } from "./ExecutionContextControls";
import { ExecutionContextVisualization } from "./ExecutionContextVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ExecutionContextInputs, ExecutionContextStepState } from "./types";

export const executionContextLab: LabDefinition<ExecutionContextInputs, ExecutionContextStepState> = {
  slug: "execution-context",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { a: 4, b: 5, bonus: 2 },
  getCode,
  buildInitialSteps,
  simulationControls: ExecutionContextControls,
  Visualization: ExecutionContextVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does JavaScript need a call stack?",
    bullets: [
      <>Every function call gets its own execution context.</>,
      <>A new call is pushed onto the top of the call stack.</>,
      <>JavaScript runs the call currently on top.</>,
      <>When that function returns, its frame is popped.</>,
      <>The caller beneath it resumes with the returned value.</>,
      <>This last-in, first-out behavior keeps nested calls in the correct order.</>,
    ],
    comparisonItems: [
      {
        label: "Function is called",
        columns: [
          { header: "Stack change", value: "Push a frame" },
          { header: "What happens next", value: "New function runs" },
        ],
      },
      {
        label: "Function calls another",
        columns: [
          { header: "Stack change", value: "Push another frame" },
          { header: "What happens next", value: "Caller pauses" },
        ],
      },
      {
        label: "Function returns",
        columns: [
          { header: "Stack change", value: "Pop its frame" },
          { header: "What happens next", value: "Previous caller resumes" },
        ],
      },
      {
        label: "Script finishes",
        columns: [
          { header: "Stack change", value: "Stack becomes empty" },
          { header: "What happens next", value: "Synchronous work is complete" },
        ],
      },
    ],
    columnsHeader: "Event",
    technicalNote: (
      <>
        An execution context is the runtime state associated with executing code, including its bindings,
        parameters and current position. The call stack records active execution contexts in last-in, first-out
        order. Each invocation receives a separate context, even when the same function calls itself. Too many
        nested calls without returning can exhaust the available stack and cause a{" "}
        <InlineCode>RangeError: Maximum call stack size exceeded</InlineCode>. The call stack explains synchronous
        nesting — timer callbacks, promise callbacks and event-loop scheduling are introduced in later lessons.
      </>
    ),
  },

  prediction: {
    prompt: 'While `greet("Maya")` is running, what is the call stack from bottom to top?',
    code: [
      "function greet(name) {",
      "  return `Hello, ${name}`;",
      "}",
      "",
      "function welcome() {",
      '  return greet("Maya");',
      "}",
      "",
      "const message = welcome();",
    ],
    options: [
      { id: "correct", label: 'Global → welcome() → greet("Maya")' },
      {
        id: "swapped",
        label: 'Global → greet("Maya") → welcome()',
        feedback: "`welcome()` was called first, so it sits underneath. The stack grows upward from the earliest call.",
      },
      {
        id: "only-greet",
        label: 'greet("Maya") only',
        feedback: "`welcome()` has not returned yet — it is paused underneath, still on the stack.",
      },
      {
        id: "no-greet",
        label: "Global → welcome() only",
        feedback: '`greet("Maya")` is running right now, so it must have its own frame on top.',
      },
    ],
    correctOptionId: "correct",
    explanation:
      "Global called `welcome()`, and `welcome()` called `greet()`. The most recent call, `greet()`, is on top and runs first.",
  },

  challenge: {
    question: "At the deepest point of this code, which call is on top of the stack?",
    code: [
      "function applyDiscount(price) {",
      "  return price - 5;",
      "}",
      "",
      "function checkout(price) {",
      "  return applyDiscount(price);",
      "}",
      "",
      "const total = checkout(30);",
    ],
    options: [
      { id: "applyDiscount", label: "applyDiscount(30)" },
      {
        id: "checkout",
        label: "checkout(30)",
        feedback: "`checkout(30)` is still on the stack, but paused underneath while `applyDiscount()` runs.",
      },
      {
        id: "global",
        label: "Global",
        feedback: "Global is the bottom frame — everything else is stacked on top of it.",
      },
      {
        id: "total",
        label: "total",
        feedback: "`total` is a variable, not a function call. Only calls get a frame on the stack.",
      },
    ],
    correctOptionId: "applyDiscount",
    explanation:
      "`checkout(30)` calls `applyDiscount(30)`, so `applyDiscount()` is the newest call and sits on top until it returns.",
  },

  remember:
    "A function call is pushed onto the call stack. If it calls another function, the caller waits underneath it. When the top function returns, its frame is removed and the previous function resumes.",
};
