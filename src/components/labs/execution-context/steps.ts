import type { ExecutionStep } from "@/lib/execution/types";
import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { ExecutionContextInputs, ExecutionContextStepState } from "./types";

export function buildInitialSteps({
  a,
  b,
  bonus,
}: ExecutionContextInputs): ExecutionStep<ExecutionContextStepState>[] {
  const product = a * b;
  const total = product + bonus;

  const global = (
    running: boolean,
    extra: Partial<CallStackFrame> = {}
  ): CallStackFrame => ({
    id: "global",
    label: "Global",
    isActive: running,
    statusBadge: running
      ? { text: "CURRENTLY RUNNING", tone: "new" }
      : { text: "PAUSED — WAITING FOR calculate()", tone: "changed" },
    ...extra,
  });

  const calculate = (
    running: boolean,
    extra: Partial<CallStackFrame> = {}
  ): CallStackFrame => ({
    id: "calculate",
    label: "calculate()",
    isActive: running,
    statusBadge: running
      ? { text: "CURRENTLY RUNNING", tone: "new" }
      : { text: "PAUSED — WAITING FOR multiply()", tone: "changed" },
    ...extra,
  });

  return [
    {
      id: "global-start",
      title: "Global context starts",
      description: "The script begins running in the global execution context — nothing has been called yet.",
      whyExplanation:
        "Every JavaScript file starts with one execution context already on the stack: the global context. Function calls will each add their own context on top of it.",
      activeCodeLines: [10, 11],
      state: {
        phase: "global-start",
        callStack: [global(true, { variables: [] })],
      },
    },
    {
      id: "calculate-called",
      title: "calculate() is called",
      description: "Calling calculate() pushes a new execution context onto the stack, above Global.",
      whyExplanation:
        "A function call always creates a brand-new execution context for that call. Global pauses here because a synchronous call can't finish until the function it calls returns.",
      activeCodeLines: [10],
      state: {
        phase: "calculate-called",
        callStack: [global(false), calculate(true, { variables: [] })],
      },
    },
    {
      id: "multiply-called",
      title: "multiply() is called",
      description: `Inside calculate(), calling multiply(${a}, ${b}) pushes another context on top, with its own a and b.`,
      whyExplanation: `Calling \`multiply(${a}, ${b})\` creates a new frame containing its own \`a\` and \`b\` parameter bindings. That frame sits on top, so \`multiply()\` runs while \`calculate()\` waits underneath it.`,
      activeCodeLines: [6],
      state: {
        phase: "multiply-called",
        callStack: [
          global(false),
          calculate(false, { variables: [] }),
          {
            id: "multiply",
            label: `multiply(${a}, ${b})`,
            isActive: true,
            statusBadge: { text: "CURRENTLY RUNNING", tone: "new" },
            variables: [
              { name: "a", value: a, status: "set" },
              { name: "b", value: b, status: "set" },
            ],
          },
        ],
      },
    },
    {
      id: "multiply-returns",
      title: `multiply() returns ${product}`,
      description: `multiply() finishes, its context is popped, and ${product} is passed back to calculate(), which resumes as subtotal.`,
      whyExplanation:
        "Once a function returns, JavaScript has no more use for its execution context, so it's removed from the stack — control and the return value go back to exactly where the call happened.",
      activeCodeLines: [2],
      state: {
        phase: "multiply-returns",
        callStack: [
          global(false),
          calculate(true, {
            variables: [{ name: "subtotal", value: product, status: "set" }],
            returnValue: String(product),
          }),
        ],
      },
    },
    {
      id: "calculate-returns",
      title: `calculate() returns ${total}`,
      description: `calculate() finishes, its context is popped, and ${total} is passed back to Global as total.`,
      whyExplanation:
        "The same pop-and-resume rule applies no matter how deep the stack is — calculate()'s context is discarded once it returns, and Global resumes right after the line that called it.",
      activeCodeLines: [7],
      state: {
        phase: "calculate-returns",
        callStack: [
          global(true, {
            variables: [{ name: "total", value: total, status: "set" }],
            returnValue: String(total),
          }),
        ],
      },
    },
    {
      id: "console-log",
      title: "The result is logged",
      description: 'console.log("total:", total) runs in the global context, now that total holds the finished value.',
      whyExplanation:
        "By the time this line runs, calculate() and multiply() have both already returned and left the stack — only Global remains, holding the final total.",
      activeCodeLines: [11],
      consoleOutput: [
        { id: "log-cmd", kind: "command", content: 'console.log("total:", total)' },
        { id: "log-out", kind: "output", content: `total: ${total}` },
      ],
      state: {
        phase: "console-log",
        callStack: [global(true, { variables: [{ name: "total", value: total, status: "set" }] })],
      },
    },
  ];
}
