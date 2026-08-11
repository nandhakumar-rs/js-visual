import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { MappingUsersControls } from "./MappingUsersControls";
import { MappingUsersVisualization } from "./MappingUsersVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { MappingInputs, MappingStepState } from "./types";

export const mappingUsersLab: LabDefinition<MappingInputs, MappingStepState> = {
  slug: "mapping-users",
  mode: "scripted",
  layout: "guided",
  showConsole: false,
  defaultInputs: {
    users: [
      { id: "u1", name: "Alex", age: 20 },
      { id: "u2", name: "Maya", age: 22 },
      { id: "u3", name: "John", age: 19 },
    ],
    property: "name",
  },
  getCode,
  buildInitialSteps,
  simulationControls: MappingUsersControls,
  Visualization: MappingUsersVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    bullets: [
      <>
        <InlineCode>.map()</InlineCode> repeats the same transformation for every item.
      </>,
      <>Each transformed value is collected into a new array.</>,
      <>The original array is left unchanged.</>,
    ],
    technicalNote: (
      <>
        Formally, <InlineCode>Array.prototype.map()</InlineCode> invokes a{" "}
        <InfoTooltip label="callback">
          A function passed into another function, to be invoked (called back) by it — here, once per
          array element.
        </InfoTooltip>{" "}
        with three arguments per call — <InlineCode>(element, index, array)</InlineCode> — though this
        lesson only uses the first. It skips holes entirely in sparse arrays (they&apos;re never visited,
        and leave a matching hole in the result). And while <InlineCode>.map()</InlineCode> never mutates
        the original array, if an element is itself an object, the new array holds that very same object
        reference — mutating that object would still affect both arrays.
      </>
    ),
  },

  prediction: {
    code: [
      "const numbers = [1, 2, 3];",
      "const doubled = numbers.map(number => number * 2);",
      "console.log(doubled);",
    ],
    options: [
      { id: "doubled", label: "[2, 4, 6]" },
      { id: "same", label: "[1, 2, 3]" },
      { id: "six", label: "6" },
      { id: "error", label: "TypeError" },
    ],
    correctOptionId: "doubled",
    explanation:
      "`.map()` runs `number => number * 2` for each element and collects the results, so `[1, 2, 3]` becomes `[2, 4, 6]`.",
  },

  challenge: {
    question:
      "Fill in the blank so `result` becomes an array of every user's age: `const result = users.map(user => ______);`",
    code: [
      "const users = [",
      '  { name: "Alex", age: 20 },',
      '  { name: "Maya", age: 22 },',
      '  { name: "John", age: 19 },',
      "];",
    ],
    options: [
      { id: "user-age", label: "user.age" },
      { id: "user-name", label: "user.name" },
      { id: "users-age", label: "users.age" },
      { id: "age", label: "age" },
    ],
    correctOptionId: "user-age",
    explanation:
      "Inside `.map()`'s function, `user` is the current item, so `user.age` reads that one user's age. `users.age` doesn't exist (`users` is the whole array, not a single user), and a bare `age` isn't in scope.",
  },

  remember:
    "`array.map(fn)` builds a brand new array by running `fn` once per element and collecting whatever it returns — the original array is never touched, and the new array has the same length.",
};
