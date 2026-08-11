import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ImmutableArraysControls } from "./ImmutableArraysControls";
import { ImmutableArraysVisualization } from "./ImmutableArraysVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export const immutableArraysLab: LabDefinition<ImmutableArrayInputs, ImmutableArrayStepState> = {
  slug: "immutable-arrays",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { newValue: 4, mode: "push" },
  getCode,
  buildInitialSteps,
  simulationControls: ImmutableArraysControls,
  Visualization: ImmutableArraysVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    bullets: [
      <>
        <InlineCode>push()</InlineCode> changes the array it is called on.
      </>,
      <>
        <InlineCode>[...array, value]</InlineCode> creates another array with the existing items plus the
        new value.
      </>,
      <>If the old array must stay unchanged, create a new array.</>,
    ],
    technicalNote: (
      <>
        <InlineCode>Array.prototype.push()</InlineCode> mutates the array in place and returns the array&apos;s
        new length, not the array itself. Because <InlineCode>push()</InlineCode> keeps the same{" "}
        <InfoTooltip label="reference">
          A value JavaScript uses to point to an object or array in memory.
        </InfoTooltip>
        , <InlineCode>a === same</InlineCode> stays <InlineCode>true</InlineCode> after a push, while{" "}
        <InlineCode>a === [...a]</InlineCode> is <InlineCode>false</InlineCode> — the spread version is a
        different array object. Spread is also only a{" "}
        <InfoTooltip label="shallow copy">
          A new outer array whose nested objects may still be shared with the original.
        </InfoTooltip>
        : if an element is itself an object, both arrays hold the same object reference. This is why
        immutable updates matter in state-management patterns where changes are detected by reference
        identity, such as common React state updates.
      </>
    ),
  },

  prediction: {
    code: ["const numbers = [1, 2, 3];", "const updated = [...numbers, 4];", "console.log(numbers);"],
    options: [
      { id: "same", label: "[1, 2, 3]" },
      { id: "added", label: "[1, 2, 3, 4]" },
      { id: "four", label: "[4]" },
      { id: "undefined", label: "undefined" },
    ],
    correctOptionId: "same",
    explanation: "The spread version created `updated`; it did not change `numbers`.",
  },

  challenge: {
    question: "You need to add `4` while keeping `numbers` unchanged. Which line should you use?",
    code: ["const numbers = [1, 2, 3];"],
    options: [
      { id: "push", label: "numbers.push(4);" },
      { id: "spread", label: "const updated = [...numbers, 4];" },
    ],
    correctOptionId: "spread",
    explanation: "`updated` is a new array, while `numbers` stays unchanged.",
  },

  remember:
    "`array.push(value)` changes the array in place and returns the new length. `[...array, value]` creates a brand new array with the old items plus the new one, leaving the original untouched.",
};
