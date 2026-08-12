import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ImmutableArraysControls } from "./ImmutableArraysControls";
import { ImmutableArraysVisualization } from "./ImmutableArraysVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ValuesRefInputs, ValuesRefStepState } from "./types";

export const immutableArraysLab: LabDefinition<ValuesRefInputs, ValuesRefStepState> = {
  slug: "immutable-arrays",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { startingArray: [1, 2, 3], newValue: 4, mode: "share-mutate" },
  getCode,
  buildInitialSteps,
  simulationControls: ImmutableArraysControls,
  Visualization: ImmutableArraysVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "What actually changed?",
    bullets: [
      <>Assigning a primitive copies its value.</>,
      <>Reassigning the copied primitive does not affect the original variable.</>,
      <>Assigning an array or object copies its reference value.</>,
      <>Two variables can therefore lead to the same array or object.</>,
      <>Mutation changes that shared array or object.</>,
      <>Spread creates a new outer array, leaving the original array unchanged.</>,
    ],
    technicalNote: (
      <>
        JavaScript always copies values during assignment and argument passing. For objects and arrays, that
        value is a{" "}
        <InfoTooltip label="reference">
          A value JavaScript uses to point to an object or array in memory.
        </InfoTooltip>{" "}
        to the object, not the object itself. <InlineCode>const</InlineCode> only prevents the binding from being
        reassigned to a different array — it does not freeze the array&apos;s contents, so{" "}
        <InlineCode>.push()</InlineCode> still mutates it. Array and object spread create a{" "}
        <InfoTooltip label="shallow copy">
          A new outer array whose nested objects may still be shared with the original.
        </InfoTooltip>
        : if the array contains nested objects, the new outer array is separate, but those nested objects are
        still shared with the original.
      </>
    ),
  },

  prediction: {
    code: ["const first = [1, 2];", "const second = first;", "", "second.push(3);"],
    options: [
      { id: "both-123", label: 'Both contain [1, 2, 3]' },
      { id: "first-only", label: "first contains [1, 2]; second contains [1, 2, 3]" },
      { id: "both-12", label: "Both contain [1, 2]" },
      { id: "error", label: "The code throws an error because first and second use const" },
    ],
    correctOptionId: "both-123",
    explanation:
      "`second` refers to the same array as `first`. `.push(3)` mutates that shared array, so both variables see `[1, 2, 3]`.",
  },

  challenge: {
    question:
      'Choose the expression that creates a new task array containing "Review" without changing `tasks`.',
    code: ['const tasks = ["Plan", "Build"];', "const nextTasks = ______;"],
    options: [
      { id: "spread", label: '[...tasks, "Review"]' },
      { id: "push", label: 'tasks.push("Review")' },
      { id: "nested", label: '[tasks, "Review"]' },
      { id: "index", label: 'tasks[2] = "Review"' },
    ],
    correctOptionId: "spread",
    explanation:
      '`[...tasks, "Review"]` copies the existing task values into a new array and adds "Review", so `tasks` stays unchanged. `tasks.push("Review")` mutates `tasks` and returns the new length instead of an array; `[tasks, "Review"]` nests the whole array instead of flattening it; `tasks[2] = "Review"` mutates `tasks` directly.',
  },

  remember:
    "Primitive assignments copy values. Arrays and objects can be shared through copied references. Mutation changes the shared object; creating a new array or object lets you update without changing the original.",
};
