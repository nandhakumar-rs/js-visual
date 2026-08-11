import type { ExecutionStep } from "@/lib/execution/types";
import type { ModulesInputs, ModulesStepState } from "./types";

export function buildInitialSteps({ exportStyle }: ModulesInputs): ExecutionStep<ModulesStepState>[] {
  const isNamed = exportStyle === "named";
  const importLine = isNamed ? 5 : 6;
  const callLine = isNamed ? 7 : 7;

  return [
    {
      id: "define",
      title: "math.js defines its exports",
      description: isNamed
        ? "add and multiply are each exported individually, by name."
        : "add is exported as THE default export of this module — only one default is allowed per module.",
      activeCodeLines: isNamed ? [1, 2, 3] : [1, 2, 3, 4],
      state: { mathDefined: true, imported: false },
    },
    {
      id: "import",
      title: "app.js imports from math.js",
      description: isNamed
        ? 'import { add, multiply } from "./math.js" pulls in exactly the named bindings it asks for.'
        : 'import add from "./math.js" pulls in the default export, and can name it anything locally.',
      whyExplanation:
        "ES module imports are resolved statically (before code runs), which is what lets bundlers safely tree-shake unused exports.",
      activeCodeLines: [importLine],
      state: { mathDefined: true, imported: true },
    },
    {
      id: "call",
      title: "add(2, 3) runs",
      description: "The imported add function is called like any other function.",
      activeCodeLines: [callLine],
      consoleOutput: [
        { id: "log-1", kind: "command", content: "add(2, 3)" },
        { id: "log-2", kind: "output", content: "5" },
      ],
      state: { mathDefined: true, imported: true, result: 5 },
    },
  ];
}
