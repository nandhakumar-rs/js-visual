import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { CallbackHellControls } from "./CallbackHellControls";
import { CallbackHellExperiment } from "./CallbackHellExperiment";
import { CallbackHellVisualization } from "./CallbackHellVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { CallbackHellInputs, CallbackHellStepState } from "./types";

export const callbackHellLab: LabDefinition<CallbackHellInputs, CallbackHellStepState> = {
  slug: "callback-hell",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "two-steps" },
  getCode,
  buildInitialSteps,
  simulationControls: CallbackHellControls,
  Visualization: CallbackHellVisualization,
  experimentPanel: CallbackHellExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does sequencing async steps produce a pyramid?",
    bullets: [
      <>
        Each step needs what the step before it produced &mdash; <InlineCode>getOrders</InlineCode> cannot run
        until it has <InlineCode>user.id</InlineCode>.
      </>,
      <>
        That result is delivered as an argument, so it exists only inside the previous step&apos;s callback. The
        next call has to be written in there; the nesting is forced, not chosen.
      </>,
      <>
        Every extra step therefore costs one level of indentation and one more <InlineCode>{"});"}</InlineCode>{" "}
        at the bottom.
      </>,
      <>
        There is no shared error path. An error handed to one level is invisible to the others, so the same check
        is written out once per level.
      </>,
      <>
        Moving the callbacks into named functions flattens the indentation and nothing else &mdash; same number
        of checks, more lines, and the chain now reads bottom to top.
      </>,
    ],
    comparisonItems: [
      {
        label: "Nested inline",
        columns: [
          { header: "Indentation", value: "Grows one level per step" },
          { header: "Error handling", value: "One check per level" },
          { header: "Reading order", value: "Top to bottom" },
        ],
      },
      {
        label: "Named functions",
        columns: [
          { header: "Indentation", value: "Stays flat" },
          { header: "Error handling", value: "Still one check per level" },
          { header: "Reading order", value: "Bottom to top — the chain starts on the last line" },
        ],
      },
      {
        label: "Promise chain (next lesson)",
        columns: [
          { header: "Indentation", value: "Stays flat" },
          { header: "Error handling", value: "One .catch() for the whole chain" },
          { header: "Reading order", value: "Top to bottom" },
        ],
      },
    ],
    columnsHeader: "Shape",
    technicalNote: (
      <>
        <span className="block">
          The nesting follows directly from the callback contract. A result that is delivered as an argument is
          in scope inside the receiving function and nowhere else, so any code that needs it must live there.
          Nesting depth therefore tracks the number of dependent steps exactly &mdash; it is a property of the
          data flow, not of anyone&apos;s formatting.
        </span>
        <span className="mt-2 block">
          The three costs are worth separating, because they are not fixed by the same thing. Indentation is
          cosmetic, and named functions do fix it. The duplicated error handling and the inverted reading order
          survive that change, and neither approach can guarantee a callback runs exactly once, or let you hand
          the pending result to somebody else. Promises address all of these by making the eventual result a{" "}
          <em>value</em> &mdash; one you can return, pass around and chain, with a single rejection path for the
          whole chain. That is the next lesson.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "getOrders fails. What is logged?",
    code: [
      "getUser(1, (error, user) => {",
      '  if (error) return console.log("A");',
      "  getOrders(user.id, (error, orders) => {",
      '    if (error) return console.log("B");',
      "    getItems(orders[0].id, (error, items) => {",
      '      if (error) return console.log("C");',
      '      console.log("D");',
      "    });",
      "  });",
      "});",
    ],
    options: [
      { id: "b", label: "B only" },
      {
        id: "b-then-c",
        label: "B, then C",
        feedback:
          "`return` ends the level-2 callback, so `getItems` is never called and the level-3 callback is never entered — its check cannot run.",
      },
      {
        id: "c",
        label: "C only",
        feedback:
          "The check that fires belongs to whichever level received the error. `getOrders` called back into the level-2 callback, so `B` is the one that runs.",
      },
      {
        id: "b-then-d",
        label: "B, then D",
        feedback:
          "The `return` on line 4 stops the rest of that callback, so nothing below it runs. `D` is only reachable when all three steps succeed.",
      },
    ],
    correctOptionId: "b",
    explanation:
      "Each level only handles its own error. `getOrders` fails, so the level-2 check on line 4 logs `B` and returns — `getItems` is never called, so neither `C` nor `D` can happen.",
  },

  challenge: {
    question: "Choose the reason this cannot be flattened into two consecutive lines.",
    code: [
      "getUser(1, (user) => {",
      "  getOrders(user.id, (orders) => {",
      "    console.log(orders);",
      "  });",
      "});",
    ],
    options: [
      { id: "scope", label: "getOrders needs user.id, which only exists inside getUser's callback" },
      {
        id: "parallel",
        label: "The two calls have to run at the same time",
        feedback:
          "They are deliberately sequential — the second needs the first one's result, so it cannot start any earlier.",
      },
      {
        id: "syntax",
        label: "JavaScript does not allow two function calls on consecutive lines",
        feedback:
          "It does. The obstacle is not syntax: it is that `user` does not exist outside the callback it was handed to.",
      },
      {
        id: "errors",
        label: "The callbacks must be nested for errors to propagate outward",
        feedback:
          "Errors do not propagate between callback levels at all — that is precisely the problem, and why each level needs its own check.",
      },
    ],
    correctOptionId: "scope",
    explanation:
      "`getUser` returns before the user exists, so the user is only ever delivered as an argument to its callback. Anything that needs it — including the `getOrders` call — has to be written inside that function.",
  },

  remember:
    "Sequencing async steps with callbacks nests them, because each step's result only exists inside the previous step's callback. Depth grows one level per step, and every level needs its own error check — which is what Promise chains were introduced to flatten.",
};
