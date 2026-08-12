import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ScopeVisualization } from "./ScopeVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ScopeInputs, ScopeStepState } from "./types";

export const scopeLab: LabDefinition<ScopeInputs, ScopeStepState> = {
  slug: "scope",
  mode: "scripted",
  layout: "guided",
  defaultInputs: {},
  getCode,
  buildInitialSteps,
  Visualization: ScopeVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does scope work this way?",
    bullets: [
      <>Scope keeps variables limited to the parts of the program that need them.</>,
      <>JavaScript begins searching in the current scope.</>,
      <>If the variable is not there, JavaScript searches the enclosing scope.</>,
      <>The search continues outward until the variable is found.</>,
      <>JavaScript never searches inward into child scopes.</>,
      <>
        <InlineCode>let</InlineCode> and <InlineCode>const</InlineCode> declared inside <InlineCode>{"{}"}</InlineCode>{" "}
        are block-scoped.
      </>,
      <>A missing identifier causes a ReferenceError.</>,
    ],
    comparisonItems: [
      {
        label: "appName",
        columns: [
          { header: "Declared in", value: "Global scope" },
          { header: "Accessible from", value: "Global, function and block" },
        ],
      },
      {
        label: "userName",
        columns: [
          { header: "Declared in", value: "Function scope" },
          { header: "Accessible from", value: "Function and its inner block" },
        ],
      },
      {
        label: "message",
        columns: [
          { header: "Declared in", value: "Block scope" },
          { header: "Accessible from", value: "Only that block and scopes nested inside it" },
        ],
      },
    ],
    columnsHeader: "Variable",
    technicalNote: (
      <>
        JavaScript uses lexical scope: accessibility depends on where code is written. Each scope has bindings
        associated with a lexical environment, and identifier resolution follows the outer-environment chain.{" "}
        <InlineCode>let</InlineCode> and <InlineCode>const</InlineCode> are block-scoped, while{" "}
        <InlineCode>var</InlineCode> is function-scoped rather than block-scoped. If no matching binding exists
        anywhere in the scope chain, evaluating the identifier throws a{" "}
        <InlineCode>ReferenceError</InlineCode>. In this example, <InlineCode>appName</InlineCode> is declared at
        the top level. In a classic script, this can be described as global scope. In an ES module, top-level
        declarations are module-scoped and do not become properties of <InlineCode>globalThis</InlineCode>.
        Accessibility and value lifetime are related but not identical — Closures will explain how an inner
        function can retain access to an outer scope later. Declaration availability before a line runs (hoisting)
        is covered in its own lesson.
      </>
    ),
  },

  prediction: {
    prompt: "What happens when console.log(message) runs?",
    code: [
      "function prepareLesson() {",
      "  if (true) {",
      '    const message = "Ready";',
      "  }",
      "  console.log(message);",
      "}",
      "",
      "prepareLesson();",
    ],
    options: [
      { id: "ready", label: 'It logs "Ready"' },
      { id: "undefined", label: "It logs undefined" },
      { id: "reference-error", label: "It throws a ReferenceError" },
      { id: "null", label: "It logs null" },
    ],
    correctOptionId: "reference-error",
    explanation:
      "Correct answer: it throws a ReferenceError. `message` belongs to the `if` block. Code in the surrounding function cannot look inward to access it.",
  },

  challenge: {
    question:
      "Choose the expression that can read one variable from each visible scope while execution is inside the if block.",
    code: [
      'const appName = "JS Visual Lab";',
      "",
      "function startLesson() {",
      '  const learner = "Maya";',
      "  if (learner) {",
      '    const status = "ready";',
      "    const summary = ________;",
      "  }",
      "}",
      "",
      "startLesson();",
    ],
    options: [
      { id: "appName", label: "[appName, learner, status]" },
      { id: "message", label: "[learner, status, message]" },
      { id: "userName", label: "[appName, userName]" },
      { id: "courseName", label: "[status, courseName]" },
    ],
    correctOptionId: "appName",
    explanation:
      "The block can read `status` from its current scope, `learner` from the surrounding function scope, and `appName` from the global scope.",
  },

  remember:
    "JavaScript looks for a variable in the current scope and then moves outward. Inner code can use values from enclosing scopes, but outer code cannot access variables declared only inside an inner scope.",
};
