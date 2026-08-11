import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { UserExistenceControls } from "./UserExistenceControls";
import { UserExistenceVisualization } from "./UserExistenceVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { UserExistenceInputs, UserExistenceStepState } from "./types";

export const userExistenceLab: LabDefinition<UserExistenceInputs, UserExistenceStepState> = {
  slug: "user-existence",
  mode: "scripted",
  layout: "guided",
  showConsole: false,
  showWhyPanel: false,
  defaultInputs: {
    users: [{ name: "Alex" }, { name: "Maya" }, { name: "John" }, { name: "Priya" }],
    searchName: "Maya",
    outcome: "some",
  },
  getCode,
  buildInitialSteps,
  simulationControls: UserExistenceControls,
  Visualization: UserExistenceVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "What do you need back?",
    bullets: [
      <>
        Need a yes or no? Use <InlineCode>some()</InlineCode> — it returns <InlineCode>true</InlineCode> or{" "}
        <InlineCode>false</InlineCode>.
      </>,
      <>
        Need the matching item? Use <InlineCode>find()</InlineCode> — it returns the item, or{" "}
        <InlineCode>undefined</InlineCode>.
      </>,
      <>
        Need its position? Use <InlineCode>findIndex()</InlineCode> — it returns the index, or{" "}
        <InlineCode>-1</InlineCode>.
      </>,
      <>
        Need manual control? Use a <InlineCode>for...of</InlineCode> loop — it returns whatever you
        implement.
      </>,
      <>All of these can search. The important difference is what each one returns.</>,
    ],
    technicalNote: (
      <>
        The function passed to <InlineCode>some()</InlineCode>, <InlineCode>find()</InlineCode>, or{" "}
        <InlineCode>findIndex()</InlineCode> is a{" "}
        <InfoTooltip label="predicate callback">
          A function that runs once per element and returns a true/false-ish result deciding whether that
          element counts as a match.
        </InfoTooltip>
        , receiving the current element, index, and array (though this lesson only uses the element). All
        three stop as soon as the callback&apos;s result is truthy — a manual loop only stops early if the
        code uses <InlineCode>break</InlineCode> or <InlineCode>return</InlineCode> itself.{" "}
        <InlineCode>find()</InlineCode> is preferable to{" "}
        <InlineCode>filter()[0]</InlineCode> when only the first match is needed, because{" "}
        <InlineCode>find()</InlineCode> can stop as soon as it finds that match instead of building a full
        array of every match. The comparison in this lesson is case-sensitive.
      </>
    ),
  },

  prediction: {
    code: [
      "const users = [",
      '  { name: "Asha" },',
      '  { name: "Ravi" },',
      '  { name: "Noor" },',
      "];",
      "",
      'const exists = users.some(user => user.name === "Priya");',
    ],
    options: [
      { id: "true", label: "true" },
      { id: "false", label: "false" },
      { id: "undefined", label: "undefined" },
      { id: "minusone", label: "-1" },
    ],
    correctOptionId: "false",
    explanation:
      "Every user is checked and none is named `Priya`, so `some()` returns `false`. It returns `undefined` only for `find()` and `-1` only for `findIndex()` — `some()` always returns a boolean.",
  },

  challenge: {
    question: "Choose the code that checks whether at least one user is active.",
    code: [
      "const users = [",
      '  { name: "Alex", active: false },',
      '  { name: "Maya", active: true },',
      '  { name: "John", active: false },',
      "];",
      "",
      "const hasActiveUser = ________;",
    ],
    options: [
      { id: "some", label: "users.some(user => user.active)" },
      { id: "find", label: "users.find(user => user.active)" },
      { id: "map", label: "users.map(user => user.active)" },
      { id: "findIndex", label: "users.findIndex(user => user.active)" },
    ],
    correctOptionId: "some",
    explanation:
      "The question needs a yes/no answer, so `users.some(user => user.active)` gives us the correct result shape: `true` or `false`. `find()` would return the matching user object, `map()` returns a new array of every user's `active` value, and `findIndex()` returns a numeric position.",
  },

  remember:
    "Ask what you need back: `some()` → yes or no. `find()` → the first matching item. `findIndex()` → the matching position. `for...of` → manual control.",
};
