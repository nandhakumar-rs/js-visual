import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ClosuresControls } from "./ClosuresControls";
import { ClosuresExperiment } from "./ClosuresExperiment";
import { ClosuresVisualization } from "./ClosuresVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ClosuresInputs, ClosuresStepState } from "./types";

export const closuresLab: LabDefinition<ClosuresInputs, ClosuresStepState> = {
  slug: "closures",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "one-counter" },
  getCode,
  buildInitialSteps,
  simulationControls: ClosuresControls,
  Visualization: ClosuresVisualization,
  experimentPanel: ClosuresExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does count survive after createCounter() finishes?",
    bullets: [
      <>
        Every call to <InlineCode>createCounter()</InlineCode> runs{" "}
        <InlineCode>let count = 0;</InlineCode> again, creating a new variable in that call&apos;s own scope.
      </>,
      <>The function being returned is created inside that scope, so it can reach the variable.</>,
      <>
        Because the returned function keeps a reference to that scope, the scope is not discarded when{" "}
        <InlineCode>createCounter()</InlineCode> returns.
      </>,
      <>That kept-alive pairing of a function and the scope it was created in is a closure.</>,
      <>
        The only way in is through the returned function &mdash; <InlineCode>count</InlineCode> cannot be read from
        outside.
      </>,
    ],
    comparisonItems: [
      {
        label: "const counterA = createCounter();",
        columns: [
          { header: "What it does", value: "Creates a new count (0) and a function that owns it" },
          { header: "Effect elsewhere", value: "None" },
        ],
      },
      {
        label: "counterA();",
        columns: [
          { header: "What it does", value: "Reads and updates counterA's own count" },
          { header: "Effect elsewhere", value: "None" },
        ],
      },
      {
        label: "const counterB = createCounter();",
        columns: [
          { header: "What it does", value: "Creates a second, separate count (0)" },
          { header: "Effect elsewhere", value: "counterA's count is untouched" },
        ],
      },
      {
        label: "console.log(count);",
        columns: [
          { header: "What it does", value: "Searches the surrounding scopes for a binding named count" },
          { header: "Effect elsewhere", value: "None exists outside — throws a ReferenceError" },
        ],
      },
    ],
    columnsHeader: "Line",
    technicalNote: (
      <>
        <span className="block">
          A closure is created once per <em>call</em>, not once per function. The returned function holds a
          reference to the lexical environment created for that particular invocation, which is why two calls to{" "}
          <InlineCode>createCounter()</InlineCode> produce two independent <InlineCode>count</InlineCode>{" "}
          variables. While that reference exists the environment stays reachable, so it is not collected when the
          call returns.
        </span>
        <span className="mt-2 block">
          Strictly speaking every function closes over the scope it was defined in. The behavior only becomes
          observable when the function outlives that scope, as it does here. Which variables a function may reach
          is decided by where it is written &mdash; that is Scope. When each binding becomes usable within its
          scope is Hoisting. Closures are about how long those bindings stay alive.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "What does `console.log(tagB())` print?",
    code: [
      "function makeTag() {",
      "  let uses = 0;",
      "",
      "  return function () {",
      "    uses++;",
      "    return uses;",
      "  };",
      "}",
      "",
      "const tagA = makeTag();",
      "const tagB = makeTag();",
      "",
      "tagA();",
      "console.log(tagB());",
    ],
    options: [
      { id: "one", label: "It logs 1" },
      {
        id: "two",
        label: "It logs 2",
        feedback: "`tagA` and `tagB` came from two separate calls, so `tagA()` never touched `tagB`'s `uses`.",
      },
      {
        id: "zero",
        label: "It logs 0",
        feedback: "`uses++` runs before the `return`, so the value handed back is already 1.",
      },
      {
        id: "reference-error",
        label: "It throws a ReferenceError",
        feedback: "`uses` is still reachable from inside the returned function — keeping it reachable is exactly what the closure does.",
      },
    ],
    correctOptionId: "one",
    explanation:
      "Each call to `makeTag()` creates its own `uses`. `tagB`'s copy is still 0 when it is called, so it increments to 1.",
  },

  challenge: {
    question: "Choose the line that makes `counterB()` log 1 instead of 2.",
    code: [
      "function createCounter() {",
      "  let count = 0;",
      "",
      "  return function () {",
      "    count++;",
      "    return count;",
      "  };",
      "}",
      "",
      "const counterA = createCounter();",
      "______",
      "",
      "counterA();",
      "console.log(counterB());",
    ],
    options: [
      { id: "new-call", label: "const counterB = createCounter();" },
      {
        id: "alias",
        label: "const counterB = counterA;",
        feedback:
          "Both names then refer to the same returned function, so they share one `count` and the log shows 2.",
      },
      {
        id: "invoked",
        label: "const counterB = counterA();",
        feedback:
          "That calls `counterA` and stores the number it returns, so `counterB()` throws a `TypeError` — a number is not a function.",
      },
      {
        id: "factory-ref",
        label: "const counterB = createCounter;",
        feedback:
          "That stores the factory itself, so `counterB()` returns a brand new counter function rather than a number.",
      },
    ],
    correctOptionId: "new-call",
    explanation:
      "Calling `createCounter()` a second time creates a second, separate `count`, so `counterA()` never affects it and `counterB()` starts from 0.",
  },

  remember:
    "A closure is a function plus the scope it was created in. Each call to a factory function creates a new scope, so each returned function gets its own private variables that outlive the call that made them.",
};
