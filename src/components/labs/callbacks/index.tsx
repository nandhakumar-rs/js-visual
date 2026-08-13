import type { LabDefinition } from "@/types/lab";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { CallbacksControls } from "./CallbacksControls";
import { CallbacksExperiment } from "./CallbacksExperiment";
import { CallbacksVisualization } from "./CallbacksVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { CallbacksInputs, CallbacksStepState } from "./types";

export const callbacksLab: LabDefinition<CallbacksInputs, CallbacksStepState> = {
  slug: "callbacks",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { scenario: "right-away" },
  getCode,
  buildInitialSteps,
  simulationControls: CallbacksControls,
  Visualization: CallbacksVisualization,
  experimentPanel: CallbacksExperiment,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why hand a function to another function?",
    bullets: [
      <>
        A function is a value. <InlineCode>shout</InlineCode> is the function itself;{" "}
        <InlineCode>shout()</InlineCode> is the result of running it &mdash; only the first can be handed over.
      </>,
      <>
        Whoever receives it decides when it runs: immediately, after a timer, many times, or not at all.
      </>,
      <>
        A function whose work finishes later has to return before the answer exists, so it has nothing useful to
        return.
      </>,
      <>Calling the function you handed over is how the answer gets back to you &mdash; as an argument.</>,
      <>
        By convention the callback&apos;s first parameter is the error, so failures travel the same route results
        do.
      </>,
    ],
    comparisonItems: [
      {
        label: "getUser(1, showUser);",
        columns: [
          { header: "What it does", value: "Hands the function over without running it" },
          { header: "Effect", value: "getUser decides when it runs" },
        ],
      },
      {
        label: "getUser(1, showUser());",
        columns: [
          { header: "What it does", value: "Runs showUser first and hands over what it returned" },
          { header: "Effect", value: "getUser receives undefined and throws a TypeError when it tries to call it" },
        ],
      },
      {
        label: "callback(null, user);",
        columns: [
          { header: "What it does", value: "Calls back with no error and a result" },
          { header: "Effect", value: "The success branch of your callback runs" },
        ],
      },
      {
        label: 'callback(new Error("No user 0"), null);',
        columns: [
          { header: "What it does", value: "Calls back with an error and no result" },
          { header: "Effect", value: "The error branch runs; user is null" },
        ],
      },
    ],
    columnsHeader: "Line",
    technicalNote: (
      <>
        <span className="block">
          Nothing in the language marks a function as a callback. Functions are values, so passing one is an
          ordinary argument pass, and <InlineCode>callback</InlineCode> is only a parameter name. Nothing enforces
          the contract either &mdash; a receiving function is free to call it twice, or to lose it and never call
          it at all, which is one of the things Promises later fix by making settlement happen exactly once.
        </span>
        <span className="mt-2 block">
          Passing a callback does not make code asynchronous. In the first scenario{" "}
          <InlineCode>greet</InlineCode> calls it on the very next line and everything stays in order; what makes{" "}
          <InlineCode>getUser</InlineCode> asynchronous is <InlineCode>setTimeout</InlineCode> handing the work to
          a timer. That is also why an error delivered through a callback is never thrown, so a{" "}
          <InlineCode>try</InlineCode>/<InlineCode>catch</InlineCode> around the call cannot see it. Where your
          handed-over function waits during that second, and what decides the exact moment it runs, is the Event
          Loop lesson.
        </span>
      </>
    ),
  },

  prediction: {
    prompt: "In what order do the three logs appear?",
    code: [
      "function saveNote(text, callback) {",
      "  setTimeout(() => {",
      '    callback("saved");',
      "  }, 0);",
      "}",
      "",
      'console.log("A");',
      "",
      'saveNote("hi", (status) => {',
      "  console.log(status);",
      "});",
      "",
      'console.log("B");',
    ],
    options: [
      { id: "a-b-saved", label: "A, B, saved" },
      {
        id: "a-saved-b",
        label: "A, saved, B",
        feedback:
          "`setTimeout` never runs its function during the line that schedules it. `saveNote` returns straight away, so `console.log(\"B\")` is next.",
      },
      {
        id: "saved-a-b",
        label: "saved, A, B",
        feedback: "`saveNote` is not even called until after `A` is logged — and even then it only sets a timer.",
      },
      {
        id: "a-b",
        label: "A, B — the callback never runs",
        feedback: "The callback does run, just last. Nothing was cancelled by `saveNote` returning first.",
      },
    ],
    correctOptionId: "a-b-saved",
    explanation:
      "`saveNote` hands your function to a timer and returns immediately, so `B` is logged while the callback is still waiting. A delay of `0` means \"as soon as possible after the current work finishes\", not \"right now\".",
  },

  challenge: {
    question: "Choose what goes in the blank so that `work` logs `finished`.",
    code: [
      "function onDone(result) {",
      "  console.log(result);",
      "}",
      "",
      "function work(callback) {",
      '  callback("finished");',
      "}",
      "",
      "work(______);",
    ],
    options: [
      { id: "reference", label: "onDone" },
      {
        id: "called",
        label: "onDone()",
        feedback:
          "That runs `onDone` right now with no argument — logging `undefined` — and hands `work` its return value, which is `undefined`. `work` then throws a `TypeError` trying to call it.",
      },
      {
        id: "called-with-arg",
        label: 'onDone("finished")',
        feedback:
          "This one looks right because `finished` really is logged — but it is logged before `work` is even entered, and `work` still receives `undefined` and throws a `TypeError`.",
      },
      {
        id: "string",
        label: '"onDone"',
        feedback: "That is a string, not the function. `work` throws a `TypeError` — a string cannot be called.",
      },
    ],
    correctOptionId: "reference",
    explanation:
      "`onDone` is the function itself; anything with `()` after it is the result of having called it. A callback is handed over uncalled precisely so the receiving function can choose the moment.",
  },

  remember:
    "A callback is a function you hand to another function so it can be called later. Because the caller does not wait, the answer comes back through the callback rather than through a return value — and by convention, so does the error.",
};
