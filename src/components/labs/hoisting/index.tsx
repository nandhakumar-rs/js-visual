import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { HoistingControls } from "./HoistingControls";
import { HoistingExperiment } from "./HoistingExperiment";
import { HoistingVisualization } from "./HoistingVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { HoistingInputs, HoistingStepState } from "./types";

export const hoistingLab: LabDefinition<HoistingInputs, HoistingStepState> = {
  slug: "hoisting",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "var" },
  getCode,
  buildInitialSteps,
  simulationControls: HoistingControls,
  Visualization: HoistingVisualization,
  experimentPanel: HoistingExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does JavaScript behave this way?",
    bullets: [
      <>JavaScript prepares declarations before executing the statements in a scope.</>,
      <>
        <InlineCode>var</InlineCode> is initialized with <InlineCode>undefined</InlineCode>.
      </>,
      <>
        <InlineCode>let</InlineCode> and <InlineCode>const</InlineCode> remain uninitialized in the TDZ until their
        declaration executes.
      </>,
      <>Function declarations are initialized with their functions and can be called early.</>,
    ],
    comparisonItems: [
      {
        label: "var",
        columns: [
          { header: "Before its line", value: "Initialized with undefined" },
          { header: "After its line", value: "Assigned value" },
        ],
      },
      {
        label: "let",
        columns: [
          { header: "Before its line", value: "Uninitialized; early access throws ReferenceError" },
          { header: "After its line", value: "Initialized value" },
        ],
      },
      {
        label: "const",
        columns: [
          { header: "Before its line", value: "Uninitialized; early access throws ReferenceError" },
          { header: "After its line", value: "Initialized value" },
        ],
      },
      {
        label: "function declaration",
        columns: [
          { header: "Before its line", value: "Function initialized and callable" },
          { header: "After its line", value: "Callable" },
        ],
      },
    ],
    columnsHeader: "Declaration",
    technicalNote: (
      <>
        <span className="block">
          Setting up a scope&apos;s environment happens before any statement in that scope executes.
          &ldquo;Hoisting&rdquo; is an informal description of the declaration behavior you can observe from that — no
          code is moved.
        </span>
        <span className="mt-2 block">
          The TDZ is the period from entering a binding&apos;s scope until its declaration is evaluated. It is not a
          separate physical memory area. <InlineCode>let value;</InlineCode> becomes initialized with{" "}
          <InlineCode>undefined</InlineCode> when that declaration executes, while <InlineCode>const</InlineCode>{" "}
          requires an initializer.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "What happens when console.log(score) runs?",
    code: ["function showScore() {", "  console.log(score);", "  let score = 10;", "}", "", "showScore();"],
    options: [
      {
        id: "ten",
        label: "It logs 10",
        feedback: "The assignment has not executed yet.",
      },
      {
        id: "undefined",
        label: "It logs undefined",
        feedback: "That is the early-read behavior of `var`, not `let`.",
      },
      { id: "reference-error", label: "It throws a ReferenceError" },
      {
        id: "null",
        label: "It logs null",
        feedback: "JavaScript does not automatically initialize the binding with `null`.",
      },
    ],
    correctOptionId: "reference-error",
    explanation:
      "The `score` binding exists, but it is still uninitialized when `console.log()` tries to read it. It is in the Temporal Dead Zone, so JavaScript throws a ReferenceError.",
  },

  challenge: {
    question:
      'Choose the declaration that allows startLesson() to be called before its declaration line and logs "Ready".',
    code: ["function launch() {", "  startLesson();", "", "  ______", "}", "", "launch();"],
    options: [
      {
        id: "declaration",
        label: 'function startLesson() { console.log("Ready"); }',
      },
      {
        id: "const",
        label: 'const startLesson = () => { console.log("Ready"); };',
        feedback: "The binding is still in the TDZ on the call line, so the call throws a `ReferenceError`.",
      },
      {
        id: "let",
        label: 'let startLesson = () => { console.log("Ready"); };',
        feedback: "`let` behaves the same as `const` here: the binding is in the TDZ, so the call throws a `ReferenceError`.",
      },
      {
        id: "var",
        label: 'var startLesson = () => { console.log("Ready"); };',
        feedback:
          "The binding holds `undefined` at that point, and `undefined` cannot be called — so this throws a `TypeError`.",
      },
    ],
    correctOptionId: "declaration",
    explanation:
      "Only the function declaration is initialized with its function during scope preparation, so it is already callable above its own line.",
  },

  remember:
    "JavaScript prepares declarations before running statements. `var` starts as `undefined`, `let` and `const` remain uninitialized in the TDZ, and function declarations are ready to call. Hoisting does not mean the code is physically moved.",
};
